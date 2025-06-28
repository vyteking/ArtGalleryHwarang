from django.db import models
from uuid import uuid
from . import userinfo
from . import post as HwarangPost

# Create your models here.
class Reply(models.Model):
    replyindex = models.UUIDField(primary_key=True, null=False, auto_created=True, unique=True, default=uuid.uuid4, editable=False)
    replylevel = models.IntegerField(editable=False)
    post = models.ForeignKey(HwarangPost.Post.postindex, pn_delete=models.CASCADE, editable=False)
    replyauthor = models.ForeignKey(userinfo.Userinfo.userinfoindex1st, editable=False)
    replycontent = models.TextField(editable=True)
