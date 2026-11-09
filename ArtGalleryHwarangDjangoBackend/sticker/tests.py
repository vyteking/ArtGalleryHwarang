from django.core.files.storage import default_storage
from django.test import TestCase
from rest_framework.test import APIClient

from mongodb import LARGE_STICKERS, MINI_STICKER_PACKAGES, MINI_STICKERS, REPLIES, collection
from mongotesting import MongoTestMixin, image_upload
from post import documents as post_documents
from reply import documents as reply_documents
from userinfo.models import UserInfo


class StickerApiTest(MongoTestMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.admin = UserInfo.objects.create_superuser(user_id='admin', password='pw')
        self.user = UserInfo.objects.create_user(user_id='user', password='pw')
        self.client = APIClient()

    def create_package(self, kind):
        self.client.force_authenticate(self.admin)
        return self.client.post(f'/s/{kind}-sticker-packs/', {
            f'{kind}_sticker_package_name': 'Pack',
            f'{kind}_sticker_package_image_file': image_upload('pack.png'),
        }, format='multipart')

    def create_sticker(self, kind, package_index):
        return self.client.post(f'/s/{kind}-sticker-packs/{package_index}/stickers/', {
            f'{kind}_sticker_name': 'Smile',
            f'{kind}_sticker_image_file': image_upload('smile.png'),
        }, format='multipart')

    def test_admin_creates_package_and_sticker(self):
        response = self.create_package('mini')
        self.assertEqual(response.status_code, 201, response.data)
        package_index = response.data['mini_sticker_package_index']
        self.assertEqual(response.data['share_range'], 16)
        self.assertIn('/m/stickers/mini/packages/pack', response.data['mini_sticker_package_image_file'])

        response = self.create_sticker('mini', package_index)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['package'], package_index)

        self.client.force_authenticate(None)
        [package] = self.client.get('/s/mini-sticker-packs/').data['results']
        self.assertEqual([s['mini_sticker_name'] for s in package['stickers']], ['Smile'])
        sticker_index = package['stickers'][0]['mini_sticker_index']
        self.assertEqual(self.client.get(f'/s/mini-stickers/{sticker_index}/').status_code, 200)

    def test_non_admin_cannot_write(self):
        self.client.force_authenticate(self.user)
        response = self.client.post('/s/mini-sticker-packs/', {
            'mini_sticker_package_name': 'Pack', 'mini_sticker_package_image_file': image_upload(),
        }, format='multipart')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(collection(MINI_STICKER_PACKAGES).count_documents({}), 0)

    def test_update_package(self):
        package_index = self.create_package('mini').data['mini_sticker_package_index']
        response = self.client.patch(f'/s/mini-sticker-packs/{package_index}/',
                                     {'mini_sticker_package_name': 'Renamed', 'share_range': 8}, format='multipart')
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual((response.data['mini_sticker_package_name'], response.data['share_range']), ('Renamed', 8))

    def test_deleting_package_deletes_stickers_and_files(self):
        package_index = self.create_package('mini').data['mini_sticker_package_index']
        self.create_sticker('mini', package_index)
        stored = collection(MINI_STICKERS).find_one()['mini_sticker_image_file']

        self.assertEqual(self.client.delete(f'/s/mini-sticker-packs/{package_index}/').status_code, 204)
        self.assertEqual(collection(MINI_STICKERS).count_documents({}), 0)
        self.assertFalse(default_storage.exists(stored))

    def test_deleting_large_sticker_detaches_it_from_replies(self):
        package_index = self.create_package('large').data['large_sticker_package_index']
        sticker_index = self.create_sticker('large', package_index).data['large_sticker_index']
        sticker_id = collection(LARGE_STICKERS).find_one()['_id']
        post = post_documents.create_post(self.user.pk, {'posttitle': 'Post', 'postdescription': ''})
        reply = reply_documents.create_reply(post['_id'], self.user.pk, {'large_sticker_id': sticker_id})

        self.assertEqual(self.client.delete(f'/s/large-stickers/{sticker_index}/').status_code, 204)
        self.assertIsNone(collection(REPLIES).find_one({'_id': reply['_id']})['large_sticker_id'])
