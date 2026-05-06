from rest_framework import serializers
from .models import MiniStickerPackage, MiniSticker, LargeStickerPackage, LargeSticker


class MiniStickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MiniSticker
        fields = (
            'mini_sticker_index',
            'package',
            'mini_sticker_name',
            'mini_sticker_image_file',
            'mini_sticker_upload_date_time',
        )
        read_only_fields = ('mini_sticker_index', 'mini_sticker_upload_date_time')


class MiniStickerPackageSerializer(serializers.ModelSerializer):
    stickers = MiniStickerSerializer(many=True, read_only=True)

    class Meta:
        model = MiniStickerPackage
        fields = (
            'mini_sticker_package_index',
            'mini_sticker_package_name',
            'mini_sticker_package_image_file',
            'share_range',
            'mini_sticker_package_post_date_time',
            'stickers',
        )
        read_only_fields = ('mini_sticker_package_index', 'mini_sticker_package_post_date_time')


class LargeStickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = LargeSticker
        fields = (
            'large_sticker_index',
            'package',
            'large_sticker_name',
            'large_sticker_image_file',
            'large_sticker_upload_date_time',
        )
        read_only_fields = ('large_sticker_index', 'large_sticker_upload_date_time')


class LargeStickerPackageSerializer(serializers.ModelSerializer):
    stickers = LargeStickerSerializer(many=True, read_only=True)

    class Meta:
        model = LargeStickerPackage
        fields = (
            'large_sticker_package_index',
            'large_sticker_package_name',
            'large_sticker_package_image_file',
            'share_range',
            'large_sticker_package_post_date_time',
            'stickers',
        )
        read_only_fields = ('large_sticker_package_index', 'large_sticker_package_post_date_time')
