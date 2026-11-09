from django.core.files.storage import default_storage
from django.test import TestCase
from rest_framework.test import APIClient

from mongodb import POSTS, collection
from mongotesting import MongoTestMixin, image_upload
from post import documents as post_documents
from userinfo.models import UserInfo


class PostContentApiTest(MongoTestMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.author = UserInfo.objects.create_user(user_id='author', password='pw')
        self.other = UserInfo.objects.create_user(user_id='other', password='pw')
        self.post = post_documents.create_post(self.author.pk, {'posttitle': 'Post', 'postdescription': ''})
        self.client = APIClient()

    def add_content(self, user=None):
        self.client.force_authenticate(user or self.author)
        return self.client.post('/c/api/add', {'postindex': str(self.post['_id'])})

    def test_upload_flow_used_by_post_editor(self):
        # Same two requests as posteditor.tsx: create a content, then attach an image to it.
        response = self.add_content()
        self.assertEqual(response.status_code, 201, response.data)
        postcontentindex = response.data['postcontentindex']
        self.assertEqual(response.data['postindex'], str(self.post['_id']))
        self.assertEqual(response.data['image2d'], [])

        response = self.client.post('/c/api/add/image2d', {
            'postcontentindex': postcontentindex, 'imagefile': image_upload('cat.png'), 'description': '',
        }, format='multipart')
        self.assertEqual(response.status_code, 201, response.data)
        self.assertIn(f"/m/{self.post['_id']}/{postcontentindex}/image2d/cat", response.data['imagefile'])
        self.assertIsNone(response.data['thumbnailimagefile'])

        [content] = collection(POSTS).find_one({'_id': self.post['_id']})['contents']
        [image] = content['image2d']
        self.assertTrue(default_storage.exists(image['imagefile']))
        self.assertEqual(image['thumbnailimagefile'], '')

        listed = self.client.get(f"/c/posts/{self.post['_id']}/").data
        self.assertEqual(len(listed), 1)
        self.assertEqual(listed[0]['image2d'][0]['imagefile'], response.data['imagefile'])
        self.assertEqual(listed[0]['image2d'][0]['postcontentindex'], postcontentindex)

        detail = self.client.get(f'/c/{postcontentindex}').data
        self.assertEqual(detail['postcontentindex'], postcontentindex)

    def test_blog_content(self):
        postcontentindex = self.add_content().data['postcontentindex']
        response = self.client.post('/c/api/add/blog', {'postcontentindex': postcontentindex, 'blogcontext': 'Hi'})
        self.assertEqual(response.status_code, 201, response.data)
        content = collection(POSTS).find_one({'_id': self.post['_id']})['contents'][0]
        self.assertEqual(content['blogcontent'][0]['blogcontext'], 'Hi')

    def test_only_post_owner_can_add_contents(self):
        self.assertEqual(self.add_content(self.other).status_code, 403)
        postcontentindex = self.add_content().data['postcontentindex']

        self.client.force_authenticate(self.other)
        response = self.client.post('/c/api/add/image2d', {
            'postcontentindex': postcontentindex, 'imagefile': image_upload(),
        }, format='multipart')
        self.assertEqual(response.status_code, 403)
        content = collection(POSTS).find_one({'_id': self.post['_id']})['contents'][0]
        self.assertEqual(content['image2d'], [])

    def test_unknown_content_is_404(self):
        self.client.force_authenticate(self.author)
        response = self.client.post('/c/api/add/blog', {
            'postcontentindex': '00000000-0000-0000-0000-000000000000', 'blogcontext': 'Hi',
        })
        self.assertEqual(response.status_code, 404)

    def test_delete_content_removes_its_files(self):
        postcontentindex = self.add_content().data['postcontentindex']
        self.client.post('/c/api/add/image2d', {
            'postcontentindex': postcontentindex, 'imagefile': image_upload(),
        }, format='multipart')
        stored = collection(POSTS).find_one({'_id': self.post['_id']})['contents'][0]['image2d'][0]['imagefile']

        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.delete(f'/c/{postcontentindex}/delete').status_code, 403)
        self.client.force_authenticate(self.author)
        self.assertEqual(self.client.delete(f'/c/{postcontentindex}/delete').status_code, 204)

        self.assertEqual(collection(POSTS).find_one({'_id': self.post['_id']})['contents'], [])
        self.assertFalse(default_storage.exists(stored))
