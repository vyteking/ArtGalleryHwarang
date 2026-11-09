from rest_framework import serializers

from sticker.documents import LARGE, find_sticker
from sticker.serializers import LargeStickerSerializer
from userinfo.lookup import UserLookupMixin, UserPrefetchListSerializer
from userinfo.serializers import PublicUserInfoSerializer
from . import documents


class ReplySerializer(UserLookupMixin, serializers.Serializer):
    user_id_fields = ('author_id',)

    replyindex = serializers.UUIDField(source='_id', read_only=True)
    replylevel = serializers.IntegerField(read_only=True)
    post = serializers.UUIDField(source='post_id', read_only=True)
    replyauthor = serializers.SerializerMethodField()
    replycontent = serializers.CharField(allow_blank=True, required=False)
    # Large sticker attached standalone to this reply: a UUID on write, the UUID plus a nested detail on read.
    large_sticker = serializers.UUIDField(source='large_sticker_id', allow_null=True, required=False)
    large_sticker_detail = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        list_serializer_class = UserPrefetchListSerializer

    def get_replyauthor(self, obj):
        user = self.get_user(obj['author_id'])
        return PublicUserInfoSerializer(user).data if user else None

    def _sticker(self, sticker_id):
        cache = self.context.setdefault('_large_stickers', {})
        if sticker_id not in cache:
            cache[sticker_id] = find_sticker(LARGE, sticker_id)
        return cache[sticker_id]

    def get_large_sticker_detail(self, obj):
        sticker_id = obj.get('large_sticker_id')
        sticker = self._sticker(sticker_id) if sticker_id else None
        return LargeStickerSerializer(sticker, context=self.context).data if sticker else None

    def validate_large_sticker(self, value):
        if value is not None and self._sticker(value) is None:
            raise serializers.ValidationError('Large sticker not found.')
        return value

    def validate(self, attrs):
        replycontent = attrs.get('replycontent', '')
        large_sticker = attrs.get('large_sticker_id')
        if not replycontent and not large_sticker:
            raise serializers.ValidationError(
                "A reply must have either text content (replycontent) or a large sticker."
            )
        return attrs

    def create(self, validated_data):
        return documents.create_reply(validated_data.pop('post_id'), validated_data.pop('author_id'), validated_data)

    def update(self, instance, validated_data):
        return documents.update_reply(instance, validated_data)
