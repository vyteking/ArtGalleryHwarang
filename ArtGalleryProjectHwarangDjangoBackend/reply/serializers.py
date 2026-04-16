from rest_framework import serializers
from .models import Reply
from userinfo.serializers import PublicUserInfoSerializer
from sticker.serializers import LargeStickerSerializer


class ReplySerializer(serializers.ModelSerializer):
    replyauthor = PublicUserInfoSerializer(read_only=True)
    # Expose large_sticker as a nested read-only object; accept a UUID on write.
    large_sticker_detail = LargeStickerSerializer(source='large_sticker', read_only=True)

    class Meta:
        model = Reply
        fields = [
            'replyindex', 'replylevel', 'post', 'replyauthor',
            'replycontent', 'large_sticker', 'large_sticker_detail',
            'created_at',
        ]
        read_only_fields = ['replyindex', 'replylevel', 'post', 'replyauthor', 'large_sticker_detail', 'created_at']

    def validate(self, attrs):
        replycontent = attrs.get('replycontent', '')
        large_sticker = attrs.get('large_sticker')
        if not replycontent and not large_sticker:
            raise serializers.ValidationError(
                "A reply must have either text content (replycontent) or a large sticker."
            )
        return attrs
