from uuid import UUID

from django.test import TestCase
from rest_framework.test import APIClient

from mongodb import REPLIES, collection
from mongotesting import MongoTestMixin
from post import documents as post_documents
from sticker import documents as sticker_documents
from userinfo.models import UserInfo


class ReplyApiTest(MongoTestMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.author = UserInfo.objects.create_user(user_id='author', password='pw')
        self.other = UserInfo.objects.create_user(user_id='other', password='pw')
        self.post = post_documents.create_post(self.author.pk, {'posttitle': 'Post', 'postdescription': ''})
        self.client = APIClient()
        self.list_url = f"/r/posts/{self.post['_id']}/replies/"

    def create(self, user, data):
        self.client.force_authenticate(user)
        return self.client.post(self.list_url, data, format='json')

    def test_create_and_list(self):
        response = self.create(self.other, {'replycontent': 'Nice!'})
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['replyauthor'], {'user_index_1st': str(self.other.pk), 'user_id': 'other'})
        self.assertEqual(response.data['post'], str(self.post['_id']))
        self.assertIsNone(response.data['large_sticker_detail'])

        doc = collection(REPLIES).find_one({'_id': UUID(response.data['replyindex'])})
        self.assertEqual((doc['post_id'], doc['author_id'], doc['replycontent']),
                         (self.post['_id'], self.other.pk, 'Nice!'))

        self.create(self.author, {'replycontent': 'Thanks'})
        self.client.force_authenticate(None)
        listed = self.client.get(self.list_url).data
        self.assertEqual([r['replycontent'] for r in listed], ['Nice!', 'Thanks'])

    def test_reply_needs_text_or_sticker(self):
        self.assertEqual(self.create(self.other, {'replycontent': ''}).status_code, 400)

    def test_reply_to_missing_post_is_404(self):
        self.client.force_authenticate(self.other)
        response = self.client.post('/r/posts/00000000-0000-0000-0000-000000000000/replies/',
                                    {'replycontent': 'Hi'}, format='json')
        self.assertEqual(response.status_code, 404)

    def test_large_sticker(self):
        package = sticker_documents.create_package('large', {
            'large_sticker_package_name': 'Pack', 'large_sticker_package_image_file': None})
        sticker = sticker_documents.create_sticker('large', package['_id'], {
            'large_sticker_name': 'Wave', 'large_sticker_image_file': None})

        response = self.create(self.other, {'large_sticker': str(sticker['_id'])})
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['large_sticker'], str(sticker['_id']))
        self.assertEqual(response.data['large_sticker_detail']['large_sticker_name'], 'Wave')

        bad = self.create(self.other, {'large_sticker': '00000000-0000-0000-0000-000000000000'})
        self.assertEqual(bad.status_code, 400)

    def test_only_author_can_edit_or_delete(self):
        replyindex = self.create(self.other, {'replycontent': 'Nice!'}).data['replyindex']
        url = f'/r/replies/{replyindex}/'

        self.client.force_authenticate(self.author)
        self.assertEqual(self.client.patch(url, {'replycontent': 'Hacked'}, format='json').status_code, 403)
        self.assertEqual(self.client.delete(url).status_code, 403)

        self.client.force_authenticate(self.other)
        response = self.client.patch(url, {'replycontent': 'Edited'}, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data['replycontent'], 'Edited')
        self.assertEqual(self.client.delete(url).status_code, 204)
        self.assertEqual(collection(REPLIES).count_documents({}), 0)
