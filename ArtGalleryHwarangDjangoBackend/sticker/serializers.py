from rest_framework import serializers

from mongodb import StoredImageField
from . import documents
from .documents import LARGE, MINI, ShareRange

SHARE_RANGE_CHOICES = [s.value for s in ShareRange]


class MiniStickerSerializer(serializers.Serializer):
    mini_sticker_index = serializers.UUIDField(source='_id', read_only=True)
    package = serializers.UUIDField(source='package_id', read_only=True)
    mini_sticker_name = serializers.CharField(max_length=255)
    mini_sticker_image_file = StoredImageField()
    mini_sticker_upload_date_time = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return documents.create_sticker(MINI, validated_data.pop('package_id'), validated_data)


class MiniStickerPackageSerializer(serializers.Serializer):
    mini_sticker_package_index = serializers.UUIDField(source='_id', read_only=True)
    mini_sticker_package_name = serializers.CharField(max_length=255)
    mini_sticker_package_image_file = StoredImageField()
    share_range = serializers.ChoiceField(choices=SHARE_RANGE_CHOICES, default=ShareRange.PUBLIC.value)
    mini_sticker_package_post_date_time = serializers.DateTimeField(read_only=True)
    stickers = serializers.SerializerMethodField()

    def get_stickers(self, obj):
        stickers = documents.stickers_of_package(MINI, obj['_id'])
        return MiniStickerSerializer(stickers, many=True, context=self.context).data

    def create(self, validated_data):
        return documents.create_package(MINI, validated_data)

    def update(self, instance, validated_data):
        return documents.update_package(MINI, instance, validated_data)


class LargeStickerSerializer(serializers.Serializer):
    large_sticker_index = serializers.UUIDField(source='_id', read_only=True)
    package = serializers.UUIDField(source='package_id', read_only=True)
    large_sticker_name = serializers.CharField(max_length=255)
    large_sticker_image_file = StoredImageField()
    large_sticker_upload_date_time = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return documents.create_sticker(LARGE, validated_data.pop('package_id'), validated_data)


class LargeStickerPackageSerializer(serializers.Serializer):
    large_sticker_package_index = serializers.UUIDField(source='_id', read_only=True)
    large_sticker_package_name = serializers.CharField(max_length=255)
    large_sticker_package_image_file = StoredImageField()
    share_range = serializers.ChoiceField(choices=SHARE_RANGE_CHOICES, default=ShareRange.PUBLIC.value)
    large_sticker_package_post_date_time = serializers.DateTimeField(read_only=True)
    stickers = serializers.SerializerMethodField()

    def get_stickers(self, obj):
        stickers = documents.stickers_of_package(LARGE, obj['_id'])
        return LargeStickerSerializer(stickers, many=True, context=self.context).data

    def create(self, validated_data):
        return documents.create_package(LARGE, validated_data)

    def update(self, instance, validated_data):
        return documents.update_package(LARGE, instance, validated_data)
