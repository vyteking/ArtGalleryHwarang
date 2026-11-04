from django.test import TestCase
from rest_framework.test import APIClient

from postcontent.models import Postcontent, Image2D, Audio
from userinfo.models import UserInfo
from .models import Post


class PostByUserViewTest(TestCase):
    """Gallery listing used by the personal page."""

    def setUp(self):
        self.author = UserInfo.objects.create_user(user_id='author', password='pw')
        self.public_post = Post.objects.create(posttitle='Public', postauthor=self.author, postdescription='')
        Post.objects.create(posttitle='Private', postauthor=self.author, postdescription='', isInPublic=False)

        content = Postcontent.objects.create(postindex=self.public_post)
        # bulk_create skips the upload_to callable, so no files are written.
        Image2D.objects.bulk_create([Image2D(postcontentindex=content, imagefile='a/image.png', description='')])
        Audio.objects.bulk_create([Audio(postcontentindex=content, audiofile='a/audio.mp3')])

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
