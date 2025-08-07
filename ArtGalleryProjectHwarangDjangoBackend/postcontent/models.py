from django.db import models
import uuid
from post.models import Post as Hwarangpost

# Create your models here.
class Postcontent(models.Model):
    postcontentindex = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True, editable=False)
    postindex = models.ForeignKey(Hwarangpost, on_delete=models.CASCADE, editable=False)
    postcontenttag = models.CharField(max_length=255)

class Blogcontent(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False)
    blogcontext = models.TextField()

class Image2D(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False)
    imagefile = models.ImageField()
    description = models.TextField()

class Object3D(models.Model):
    postcontentindex = models.ForeignKey(Postcontent, on_delete=models.CASCADE, editable=False)
    objectfile = models.FileField()
    description = models.TextField()