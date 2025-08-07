import uuid
from django.db import models
from userinfo.models import UserInfo as Hwaranguserinfo

# Create your models here.
class Post(models.Model):
    postindex = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True, editable=False, null=False)
    posttitle = models.CharField(null=False, max_length=255)
    postauthor = models.ForeignKey(Hwaranguserinfo, on_delete=models.CASCADE, editable=False)
    postdescription = models.TextField()
    posttag = models.CharField(max_length=255)