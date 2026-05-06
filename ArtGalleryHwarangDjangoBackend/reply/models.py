from django.db import models
import uuid
from userinfo.models import UserInfo
from post.models import Post as HwarangPost
from sticker.models import LargeSticker

# Create your models here.
class Reply(models.Model):
    replyindex = models.UUIDField(primary_key=True, null=False, auto_created=True, unique=True, default=uuid.uuid4, editable=False)
    replylevel = models.IntegerField(default=0, editable=False)
    post = models.ForeignKey(HwarangPost, on_delete=models.CASCADE, editable=False)
    replyauthor = models.ForeignKey(UserInfo, on_delete=models.CASCADE, editable=False)
    replycontent = models.TextField(editable=True, blank=True)
    # Large sticker attached standalone to this reply (mutually exclusive with text-only replies).
    # Mini stickers are embedded inline in replycontent as {mini-sticker:<uuid>}.
    large_sticker = models.ForeignKey(LargeSticker, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
