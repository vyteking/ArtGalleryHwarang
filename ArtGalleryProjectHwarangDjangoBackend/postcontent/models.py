from django.db import models
import uuid
from post.models import Post as Hwarangpost

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
    postcontenttag = models.CharField(max_length=255, blank=True)
    rating = models.SmallIntegerField(choices=Rating.choices, default=Rating.GENERAL)
    show_range = models.SmallIntegerField(choices=ShowRange.choices, default=ShowRange.PUBLIC)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Blogcontent(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False, related_name='blogcontent')
    blogcontext = models.TextField()

class Image2D(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False, related_name='image2d')
    imagefile = models.ImageField()
    description = models.TextField()

class Object3D(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False, related_name='object3d')
    objectfile = models.FileField()
    description = models.TextField()