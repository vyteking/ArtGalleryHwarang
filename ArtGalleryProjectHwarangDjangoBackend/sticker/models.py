from django.db import models
import uuid

# Create your models here.

class ShareRange(models.IntegerChoices):
    PUBLIC = 16
    CLOSE_FRIENDS = 8
    FOLLOWERS = 4
    FOLLOWING = 2

class MiniStickerPackage(models.Model):
    mini_sticker_package_index = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    mini_sticker_package_name = models.CharField(max_length=255, editable=True, null=False)
    mini_sticker_package_image_file = models.ImageField()
    mini_sticker_package_post_date_time = models.DateTimeField(auto_new_add=True)

# Mini Sticker, Emoji. Is able to be added in the comment. 
class MiniSticker(models.Model):
    mini_sticker_index = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    mini_sticker_name = models.CharField(max_length=255, editable=True, null=False)
    mini_sticker_image_file = models.ImageField()
    mini_sticker_upload_date_time = models.DateTimeField(auto_new_add=True)

class LargeStickerPackage(models.Model):
    large_sticker_package_index = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    large_sticker_package_name = models.CharField(max_length=255, editable=True, null=False)
    large_sticker_package_image_file = models.ImageField()
    large_sticker_package_post_date_time = models.DateTimeField(auto_new_add=True)

# Large Sticker, Stamp. Separately added from the comment text context
class LargeSticker(models.Model):
    large_sticker_index = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    large_sticker_name = models.CharField(max_length=255, editable=True, null=False)
    large_sticker_image_file = models.ImageField()
    large_sticker_upload_date_time = models.DateTimeField(auto_new_add=True)