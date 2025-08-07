from django.db import models
import uuid
from userinfo.models import UserInfo
from post.models import Post as HwarangPost

# Create your models here.
class Reply(models.Model):
    replyindex = models.UUIDField(primary_key=True, null=False, auto_created=True, unique=True, default=uuid.uuid4, editable=False)
    replylevel = models.IntegerField(editable=False)
    post = models.ForeignKey(HwarangPost, on_delete=models.CASCADE, editable=False)
    replyauthor = models.ForeignKey(UserInfo, on_delete=models.CASCADE, editable=False)
    replycontent = models.TextField(editable=True)
