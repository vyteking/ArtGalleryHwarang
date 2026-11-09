from datetime import timedelta

from django.test import TestCase
from rest_framework.test import APIClient

from mongodb import POSTS, REPLIES, collection
from mongotesting import MongoTestMixin
from postcontent import documents as content_documents
from reply import documents as reply_documents
from userinfo.models import UserInfo
from . import documents


def create_post(author, title='Post', **data):
    return documents.create_post(author.pk, {'posttitle': title, 'postdescription': '', **data})


def add_item(post, content_type, **item):
    content = content_documents.add_content(post['_id'], {})
    content_documents.add_content_item(content['postcontentindex'], content_type, item)
    return content


class PostApiTest(MongoTestMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.author = UserInfo.objects.create_user(user_id='author', password='pw')
        self.other = UserInfo.objects.create_user(user_id='other', password='pw')
        self.client = APIClient()

    def test_submit_stores_post_in_mongo(self):
        self.client.force_authenticate(self.author)
        response = self.client.post('/p/api/submit', {'title': 'Hello', 'description': 'Desc', 'tags': ['a', 'b']},
                                    format='json')
        self.assertEqual(response.status_code, 201, response.data)

        doc = collection(POSTS).find_one({'posttitle': 'Hello'})
        self.assertEqual(str(doc['_id']), response.data['postindex'])
        self.assertEqual(doc['author_id'], self.author.pk)
        self.assertEqual(doc['posttag'], ['a', 'b'])
        self.assertTrue(doc['is_in_public'])
        self.assertEqual(doc['contents'], [])
        self.assertEqual(response.data['author'], {'user_index_1st': str(self.author.pk), 'username': 'author'})

    def test_submit_requires_login(self):
        response = self.client.post('/p/api/submit', {'title': 'Hello', 'description': 'Desc'}, format='json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(collection(POSTS).count_documents({}), 0)

    def test_detail_and_adjacent_posts(self):
        first = create_post(self.author, 'First')
        second = create_post(self.author, 'Second')
        third = create_post(self.author, 'Third')
        base = first['created_at']
        for offset, post in enumerate((first, second, third)):
            collection(POSTS).update_one({'_id': post['_id']}, {'$set': {'created_at': base + timedelta(seconds=offset)}})

        data = self.client.get(f"/p/{second['_id']}").data
        self.assertEqual(data['title'], 'Second')
        self.assertEqual(data['prev_postindex'], str(first['_id']))
        self.assertEqual(data['next_postindex'], str(third['_id']))

    def test_adjacent_posts_with_identical_timestamps(self):
        posts = [create_post(self.author, str(i)) for i in range(3)]
        collection(POSTS).update_many({}, {'$set': {'created_at': posts[0]['created_at']}})
        listed = [p['postindex'] for p in self.client.get('/p/api/posts').data['results']]  # newest first

        # Following next_postindex from the oldest post visits every post, in list order reversed.
        visited, current = [], listed[-1]
        while current:
            visited.append(current)
            current = self.client.get(f'/p/{current}').data['next_postindex']
        self.assertEqual(visited, listed[::-1])

    def test_missing_post_is_404(self):
        self.assertEqual(self.client.get('/p/00000000-0000-0000-0000-000000000000').status_code, 404)

    def test_list_is_paginated_newest_first(self):
        old = create_post(self.author, 'Old')
        new = create_post(self.author, 'New')
        collection(POSTS).update_one({'_id': new['_id']}, {'$set': {'created_at': old['created_at'] + timedelta(seconds=1)}})
        data = self.client.get('/p/api/posts').data
        self.assertEqual(data['count'], 2)
        self.assertEqual([p['title'] for p in data['results']], ['New', 'Old'])

    def test_update_by_owner_keeps_visibility(self):
        post = create_post(self.author, 'Before', is_in_public=False)
        self.client.force_authenticate(self.author)
        response = self.client.put(f"/p/{post['_id']}/update",
                                   {'title': 'After', 'description': 'New', 'tags': ['x']}, format='json')
        self.assertEqual(response.status_code, 200, response.data)

        doc = collection(POSTS).find_one({'_id': post['_id']})
        self.assertEqual((doc['posttitle'], doc['postdescription'], doc['posttag']), ('After', 'New', ['x']))
        self.assertFalse(doc['is_in_public'])
        self.assertGreaterEqual(doc['updated_at'], post['updated_at'])

    def test_only_owner_can_update_or_delete(self):
        post = create_post(self.author)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.put(f"/p/{post['_id']}/update",
                                         {'title': 'X', 'description': 'X'}, format='json').status_code, 403)
        self.assertEqual(self.client.delete(f"/p/{post['_id']}/delete").status_code, 403)
        self.assertEqual(collection(POSTS).count_documents({}), 1)

    def test_delete_removes_post_and_replies(self):
        post = create_post(self.author)
        reply_documents.create_reply(post['_id'], self.other.pk, {'replycontent': 'Hi'})
        self.client.force_authenticate(self.author)
        self.assertEqual(self.client.delete(f"/p/{post['_id']}/delete").status_code, 204)
        self.assertEqual(collection(POSTS).count_documents({}), 0)
        self.assertEqual(collection(REPLIES).count_documents({}), 0)

    def test_deleting_user_deletes_their_posts_and_replies(self):
        own_post = create_post(self.author)
        other_post = create_post(self.other)
        reply_documents.create_reply(other_post['_id'], self.author.pk, {'replycontent': 'Hi'})
        reply_documents.create_reply(own_post['_id'], self.other.pk, {'replycontent': 'Hi'})

        self.author.delete()

        self.assertEqual([p['_id'] for p in collection(POSTS).find()], [other_post['_id']])
        self.assertEqual(collection(REPLIES).count_documents({}), 0)


class PostByUserViewTest(MongoTestMixin, TestCase):
    """Gallery listing used by the personal page."""

    def setUp(self):
        super().setUp()
        self.author = UserInfo.objects.create_user(user_id='author', password='pw')
        self.public_post = create_post(self.author, 'Public')
        create_post(self.author, 'Private', is_in_public=False)

        add_item(self.public_post, 'image2d', imagefile='a/image.png', thumbnailimagefile='', description='')
        add_item(self.public_post, 'audio', audiofile='a/audio.mp3', duration=None, thumbnailimagefile='',
                 albumimagefile='', description='')

        self.client = APIClient()
        self.url = f'/p/u/{self.author.pk}'

    def test_lists_content_types_and_thumbnail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        results = response.data['results']
        self.assertEqual(len(results), 1)
        post = results[0]
        self.assertEqual(post['title'], 'Public')
        self.assertEqual(post['content_types'], ['image2d', 'audio'])
        self.assertTrue(post['thumbnail'].endswith('/a/image.png'))

    def test_private_posts_are_listed_for_author_only(self):
        self.client.force_authenticate(self.author)
        response = self.client.get(self.url)
        self.assertEqual({p['title'] for p in response.data['results']}, {'Public', 'Private'})

    def test_filters_by_submission_type(self):
        self.client.force_authenticate(self.author)
        image_titles = [p['title'] for p in self.client.get(self.url, {'type': 'image2d'}).data['results']]
        video_titles = [p['title'] for p in self.client.get(self.url, {'type': 'video'}).data['results']]
        self.assertEqual(image_titles, ['Public'])
        self.assertEqual(video_titles, [])

