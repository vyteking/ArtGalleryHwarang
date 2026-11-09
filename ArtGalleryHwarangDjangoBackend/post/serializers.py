from rest_framework import serializers

from mongodb import stored_file_url
from userinfo.lookup import UserLookupMixin, UserPrefetchListSerializer
from . import documents


class PostSerializer(UserLookupMixin, serializers.Serializer):
    """Serializes post documents from MongoDB; the response shape matches the former Django model API."""
    user_id_fields = ('author_id',)

    postindex = serializers.UUIDField(source='_id', read_only=True)
    title = serializers.CharField(source='posttitle', max_length=255)
    description = serializers.CharField(source='postdescription')
    tags = serializers.ListField(child=serializers.CharField(max_length=100), source='posttag', default=list)
    author = serializers.SerializerMethodField()
    # No default here: an update that omits it must keep the current value (create defaults to True).
    isInPublic = serializers.BooleanField(source='is_in_public', required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    prev_postindex = serializers.SerializerMethodField()
    next_postindex = serializers.SerializerMethodField()

    class Meta:
        list_serializer_class = UserPrefetchListSerializer

    def get_author(self, obj):
        user = self.get_user(obj['author_id'])
        return {'user_index_1st': str(user.pk), 'username': user.user_id} if user else None

    def get_prev_postindex(self, obj):
        prev = documents.adjacent_postindex(obj, 'prev')
        return str(prev) if prev else None

    def get_next_postindex(self, obj):
        nxt = documents.adjacent_postindex(obj, 'next')
        return str(nxt) if nxt else None

    def create(self, validated_data):
        return documents.create_post(validated_data.pop('author_id'), validated_data)

    def update(self, instance, validated_data):
        return documents.update_post(instance, validated_data)


# Submission types, keyed by the content item list name in each content.
# Each entry lists the image fields to try for a gallery thumbnail, in order of preference.
GALLERY_CONTENT_TYPES = {
    'blogcontent': ('thumbnailimagefile',),
    'image2d': ('thumbnailimagefile', 'imagefile'),
    'animation2d': ('thumbnailimagefile',),
    'object3d': ('thumbnailimagefile',),
    'audio': ('thumbnailimagefile', 'albumimagefile'),
    'video': ('thumbnailimagefile',),
}


class PostGallerySerializer(serializers.Serializer):
    """Gallery card for a post: submission types it contains and a thumbnail."""
    postindex = serializers.UUIDField(source='_id', read_only=True)
    title = serializers.CharField(source='posttitle')
    isInPublic = serializers.BooleanField(source='is_in_public')
    created_at = serializers.DateTimeField()
    content_types = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    def get_content_types(self, obj):
        types = []
        for content in obj.get('contents', []):
            for content_type in GALLERY_CONTENT_TYPES:
                if content_type not in types and content.get(content_type):
                    types.append(content_type)
        return types

    def get_thumbnail(self, obj):
        for content in obj.get('contents', []):
            for content_type, image_fields in GALLERY_CONTENT_TYPES.items():
                for item in content.get(content_type, []):
                    for image_field in image_fields:
                        if item.get(image_field):
                            return stored_file_url(self.context.get('request'), item[image_field])
        return None
