import uuid
from django.db import models
from . import Userinfo as Hwaranguserinfo

# Create your models here.
class Post(models.Model):
    postindex = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True, editable=False, null=False)
    posttitle = models.CharField(null=False)
    postauthor = models.ForeignKey(Hwaranguserinfo.userindex1st, on_delete=models.CASCADE, editable=False)
    postdescription = models.TextField()
    posttag = models.CharField()