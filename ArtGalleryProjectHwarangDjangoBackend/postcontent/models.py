from django.db import models
import uuid
from . import post as Hwarangpost

class Postcontent(models.Model):
    postcontentindex = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True, editable=False)
    postindex = models.ForeignKey(Hwarangpost.postindex)
    postcontenttag = models.CharField()

# Create your models here.
class Blogcontent(models.Model):
    postcontentindex = models.ForeignKey(Postcontent.postcontentindex, on_delete=models.CASCADE, editable=False)
    blogcontext = models.TextField()

class Image2D(models.Model):
    postcontextindex = models.ForeignKey(Postcontent.postcontentindex, on_delete=models.CASCADE, editable=False)
    
