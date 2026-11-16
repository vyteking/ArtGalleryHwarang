from django.test import TestCase, override_settings
from django.urls import include, path
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.test import APIClient

from .authentication import ACCOUNT_HEADER, auth_cookie_name
from .models import UserAdditionalInfo, UserInfo
from .urls import urlpatterns as userinfo_urls


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def whoami(request):
    return Response({'user': str(request.user.pk)})


urlpatterns = [
    path('u/', include(userinfo_urls)),
    path('whoami', whoami),
]


@override_settings(ROOT_URLCONF=__name__)
class CookieAuthTests(TestCase):
    PASSWORD = 'correct-horse-battery'

    def setUp(self):
        self.client = APIClient()
        self.alice = self._signup('alice')
        self.bob = self._signup('bob')

    def _signup(self, user_id):
        response = self.client.post('/u/api/signup', {'user_id': user_id, 'user_password': self.PASSWORD}, format='json')
        self.assertEqual(response.status_code, 201, response.content)
        return UserInfo.objects.get(user_id=user_id)

    def _login(self, user_id, password=None):
        return self.client.post(
            '/u/api/login', {'user_id': user_id, 'user_password': password or self.PASSWORD}, format='json')

    def _whoami(self, account):
        return self.client.get('/whoami', headers={ACCOUNT_HEADER: str(account)})

    def test_login_sets_httponly_cookie_and_hides_token(self):
        response = self._login('alice')
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('token', response.data)
        self.assertNotIn('user_password', response.data)
        cookie = response.cookies[auth_cookie_name(self.alice.pk)]
        self.assertTrue(cookie['httponly'])
        self.assertEqual(cookie['samesite'], 'Lax')

    def test_wrong_password_is_rejected_without_cookie(self):
        response = self._login('alice', 'wrong-password')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(len(response.cookies), 0)

    def test_cookie_authenticates_selected_account(self):
        self._login('alice')
        self._login('bob')
        self.assertEqual(self._whoami(self.alice.pk).data['user'], str(self.alice.pk))
        self.assertEqual(self._whoami(self.bob.pk).data['user'], str(self.bob.pk))

    def test_cookie_without_account_header_is_not_authenticated(self):
        """A cross-site form or link carries the cookie but cannot add the header."""
        self._login('alice')
        self.assertEqual(self.client.get('/whoami').status_code, 401)

    def test_another_users_token_in_cookie_is_not_accepted(self):
        self._login('alice')
        alice_key = self.client.cookies[auth_cookie_name(self.alice.pk)].value
        self.client.cookies[auth_cookie_name(self.bob.pk)] = alice_key
        self.assertEqual(self._whoami(self.bob.pk).status_code, 401)

    def test_malformed_account_header_is_not_authenticated(self):
        self._login('alice')
        self.assertEqual(self._whoami('not-a-uuid').status_code, 401)

    def test_header_token_auth_still_works_for_api_clients(self):
        token, _ = Token.objects.get_or_create(user=self.alice)
        response = self.client.get('/whoami', headers={'Authorization': f'Token {token.key}'})
        self.assertEqual(response.data['user'], str(self.alice.pk))

    def test_logout_revokes_token_and_clears_cookie(self):
        self._login('alice')
        old_key = self.client.cookies[auth_cookie_name(self.alice.pk)].value

        response = self.client.post('/u/api/logout', headers={ACCOUNT_HEADER: str(self.alice.pk)})

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Token.objects.filter(key=old_key).exists())
        self.assertEqual(response.cookies[auth_cookie_name(self.alice.pk)].value, '')
        self.assertEqual(self._whoami(self.alice.pk).status_code, 401)

    def test_logout_only_affects_that_account(self):
        self._login('alice')
        self._login('bob')
        self.client.post('/u/api/logout', headers={ACCOUNT_HEADER: str(self.alice.pk)})
        self.assertEqual(self._whoami(self.bob.pk).status_code, 200)

    def test_logout_needs_the_accounts_cookie_to_revoke(self):
        token, _ = Token.objects.get_or_create(user=self.alice)
        self.client.post('/u/api/logout', headers={ACCOUNT_HEADER: str(self.alice.pk)})
        self.assertTrue(Token.objects.filter(key=token.key).exists())

    def test_logout_rejects_malformed_account(self):
        response = self.client.post('/u/api/logout', headers={ACCOUNT_HEADER: 'not-a-uuid'})
        self.assertEqual(response.status_code, 400)

    def test_revoked_cookie_is_anonymous_on_public_views(self):
        self._login('alice')
        Token.objects.filter(user=self.alice).delete()
        response = self.client.get(f'/u/{self.alice.pk}', headers={ACCOUNT_HEADER: str(self.alice.pk)})
        self.assertEqual(response.status_code, 200)


@override_settings(ROOT_URLCONF=__name__)
class UserAdditionalInfoUpdateTests(TestCase):
    PASSWORD = 'correct-horse-battery'

    def setUp(self):
        self.client = APIClient()
        self.alice = self._signup('alice')
        self.bob = self._signup('bob')
        self._login('alice')
        self._login('bob')

    def _signup(self, user_id):
        response = self.client.post('/u/api/signup', {'user_id': user_id, 'user_password': self.PASSWORD}, format='json')
        self.assertEqual(response.status_code, 201, response.content)
        return UserInfo.objects.get(user_id=user_id)

    def _login(self, user_id):
        return self.client.post('/u/api/login', {'user_id': user_id, 'user_password': self.PASSWORD}, format='json')

    def _patch(self, account, data):
        return self.client.patch(
            f'/u/{account.pk}/info/update', data, format='json', headers={ACCOUNT_HEADER: str(account.pk)})

    def test_owner_can_set_profile_fields_with_no_prior_row(self):
        self.assertFalse(UserAdditionalInfo.objects.filter(pk=self.alice.pk).exists())

        response = self._patch(self.alice, {
            'username': 'Alice Doe', 'user_alt_name': 'Ally', 'user_description': 'Paints landscapes.',
        })

        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(response.data, {
            'username': 'Alice Doe', 'user_alt_name': 'Ally', 'user_description': 'Paints landscapes.',
        })
        info = UserAdditionalInfo.objects.get(pk=self.alice.pk)
        self.assertEqual(info.username, 'Alice Doe')
        self.assertEqual(info.user_alt_name, 'Ally')
        self.assertEqual(info.user_description, 'Paints landscapes.')

    def test_owner_can_clear_fields_on_an_existing_row(self):
        UserAdditionalInfo.objects.create(
            user_info_index_1st=self.alice, username='Alice Doe', user_alt_name='Ally', user_description='Old bio.')

        response = self._patch(self.alice, {'user_alt_name': '', 'user_description': ''})

        self.assertEqual(response.status_code, 200, response.content)
        info = UserAdditionalInfo.objects.get(pk=self.alice.pk)
        self.assertEqual(info.username, 'Alice Doe')
        self.assertEqual(info.user_alt_name, '')
        self.assertEqual(info.user_description, '')

    def test_other_user_cannot_edit_someone_elses_profile(self):
        # Account header names bob (so bob is authenticated), but the URL targets alice.
        response = self.client.patch(
            f'/u/{self.alice.pk}/info/update', {'username': 'Mallory'}, format='json',
            headers={ACCOUNT_HEADER: str(self.bob.pk)})
        self.assertEqual(response.status_code, 403)
        self.assertFalse(UserAdditionalInfo.objects.filter(pk=self.alice.pk).exists())

    def test_anonymous_cannot_edit_profile(self):
        response = self.client.patch(f'/u/{self.alice.pk}/info/update', {'username': 'Nope'}, format='json')
        self.assertEqual(response.status_code, 401)
