from django.db import models
import uuid


class ShareRange(models.IntegerChoices):
    PUBLIC = 16
    FOLLOWERS = 8
    FOLLOWING = 4
    CLOSE_FRIENDS = 2


class MiniStickerPackage(models.Model):
    """A collection of mini (emoji-sized, inline) stickers."""
    mini_sticker_package_index = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    mini_sticker_package_name = models.CharField(max_length=255)
    mini_sticker_package_image_file = models.ImageField(upload_to='stickers/mini/packages/')
    share_range = models.SmallIntegerField(choices=ShareRange.choices, default=ShareRange.PUBLIC)
    mini_sticker_package_post_date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.mini_sticker_package_name


# Mini Sticker — emoji-sized, thumb-sized. Embedded inline within reply text.
# Reference format in text: {mini-sticker:<mini_sticker_index>}
class MiniSticker(models.Model):
    mini_sticker_index = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    package = models.ForeignKey(MiniStickerPackage, on_delete=models.CASCADE, related_name='stickers')
    mini_sticker_name = models.CharField(max_length=255)
    mini_sticker_image_file = models.ImageField(upload_to='stickers/mini/')
    mini_sticker_upload_date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.mini_sticker_name


class LargeStickerPackage(models.Model):
    """A collection of large (palm-sized, standalone) stickers."""
    large_sticker_package_index = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    large_sticker_package_name = models.CharField(max_length=255)
    large_sticker_package_image_file = models.ImageField(upload_to='stickers/large/packages/')
    share_range = models.SmallIntegerField(choices=ShareRange.choices, default=ShareRange.PUBLIC)
    large_sticker_package_post_date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.large_sticker_package_name


# Large Sticker — palm-sized. Sent as a standalone attachment on a reply,
# separate from the reply's text content.
class LargeSticker(models.Model):
    large_sticker_index = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    package = models.ForeignKey(LargeStickerPackage, on_delete=models.CASCADE, related_name='stickers')
    large_sticker_name = models.CharField(max_length=255)
    large_sticker_image_file = models.ImageField(upload_to='stickers/large/')
    large_sticker_upload_date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.large_sticker_name