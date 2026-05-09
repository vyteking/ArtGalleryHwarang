from django.db import models
import uuid
from post.models import Post as Hwarangpost


def _upload(folder):
    def fn(instance, filename):
        post_id = instance.postcontentindex.postindex_id
        content_id = instance.postcontentindex_id
        return f'{post_id}/{content_id}/{folder}/{filename}'
    return fn

# Create your models here.
class Rating(models.IntegerChoices):
    EXPLICIT = 3
    QUESTIONABLE = 2
    MILD = 1
    GENERAL = 0

class ShowRange(models.IntegerChoices):
    PUBLIC = 16
    FOLLOWERS = 8
    FOLLOWING = 4
    CLOSE_FRIENDS = 2
    PATRONS = 1
    PRIVATE = 0

class Postcontent(models.Model):
    postcontentindex = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True, editable=False)
    postindex = models.ForeignKey(Hwarangpost, on_delete=models.CASCADE, editable=False)
    postcontenttitle = models.TextField(blank=True)
    postcontenttag = models.CharField(max_length=255, blank=True)
    rating = models.SmallIntegerField(choices=Rating.choices, default=Rating.GENERAL)
    show_range = models.SmallIntegerField(choices=ShowRange.choices, default=ShowRange.PUBLIC)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Blogcontent(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False, related_name='blogcontent')
    thumbnailimagefile = models.ImageField(upload_to=_upload('blogcontent/thumbnail'), blank=True)
    blogcontext = models.TextField()

class Image2D(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False, related_name='image2d')
    imagefile = models.ImageField(upload_to=_upload('image2d'))
    thumbnailimagefile = models.ImageField(upload_to=_upload('image2d/thumbnail'), blank=True)
    description = models.TextField()

class Animation2D(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False, related_name='animation2d')
    animationfile = models.FileField(upload_to=_upload('animation2d'))
    animationformat = models.CharField(max_length=63, blank=True)
    thumbnailimagefile = models.ImageField(upload_to=_upload('animation2d/thumbnail'), blank=True)
    description = models.TextField(blank=True)

class Object3D(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False, related_name='object3d')
    objectfile = models.FileField(upload_to=_upload('object3d'))
    thumbnailimagefile = models.ImageField(upload_to=_upload('object3d/thumbnail'), blank=True)
    description = models.TextField()

class Audio(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False, related_name='audio')
    audiofile = models.FileField(upload_to=_upload('audio'))
    duration = models.PositiveIntegerField(null=True, blank=True)
    thumbnailimagefile = models.ImageField(upload_to=_upload('audio/thumbnail'), blank=True)
    albumimagefile = models.ImageField(upload_to=_upload('audio/albumthumbnail'), blank=True)
    description = models.TextField(blank=True)

class Video(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False, related_name='video')
    videofile = models.FileField(upload_to=_upload('video'), blank=True)
    embed_url = models.URLField(max_length=511, blank=True)
    thumbnailimagefile = models.ImageField(upload_to=_upload('video/thumbnail'), blank=True)
    duration = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)