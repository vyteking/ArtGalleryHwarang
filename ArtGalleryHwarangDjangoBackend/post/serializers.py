from rest_framework import serializers
from userinfo.models import UserInfo
from .models import Post


class PostAuthorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user_id', read_only=True)

    class Meta:
        model = UserInfo
        fields = ('user_index_1st', 'username')


class PostSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='posttitle')
    description = serializers.CharField(source='postdescription')
    tags = serializers.ListField(child=serializers.CharField(), source='posttag', default=list)
    author = PostAuthorSerializer(source='postauthor', read_only=True)
    prev_postindex = serializers.SerializerMethodField()
    next_postindex = serializers.SerializerMethodField()

    def get_prev_postindex(self, obj):
        prev = Post.objects.filter(created_at__lt=obj.created_at).order_by('-created_at').first()
        return str(prev.postindex) if prev else None

    def get_next_postindex(self, obj):
        nxt = Post.objects.filter(created_at__gt=obj.created_at).order_by('created_at').first()
        return str(nxt.postindex) if nxt else None

    class Meta:
        model = Post
        fields = ('postindex', 'title', 'description', 'tags',
                  'author', 'isInPublic', 'created_at', 'updated_at',
                  'prev_postindex', 'next_postindex')
        read_only_fields = ('postindex', 'created_at', 'updated_at')


# Submission types, keyed by the related_name of each Postcontent child model.
# Each entry lists the image fields to try for a gallery thumbnail, in order of preference.
GALLERY_CONTENT_TYPES = {
    'blogcontent': ('thumbnailimagefile',),
    'image2d': ('thumbnailimagefile', 'imagefile'),
    'animation2d': ('thumbnailimagefile',),
    'object3d': ('thumbnailimagefile',),
    'audio': ('thumbnailimagefile', 'albumimagefile'),
    'video': ('thumbnailimagefile',),
}


class PostGallerySerializer(serializers.ModelSerializer):
    """Gallery card for a post: submission types it contains and a thumbnail."""
    title = serializers.CharField(source='posttitle')
    content_types = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('postindex', 'title', 'isInPublic', 'created_at', 'content_types', 'thumbnail')

    def _contents(self, obj):
        # Uses the prefetched postcontent_set from PostByUserView.
        return list(obj.postcontent_set.all())

    def get_content_types(self, obj):
        types = []
        for content in self._contents(obj):
            for content_type in GALLERY_CONTENT_TYPES:
                if content_type not in types and getattr(content, content_type).all():
                    types.append(content_type)
        return types

    def get_thumbnail(self, obj):
        request = self.context.get('request')
        for content in self._contents(obj):
            for content_type, image_fields in GALLERY_CONTENT_TYPES.items():
                for item in getattr(content, content_type).all():
                    for image_field in image_fields:
                        image = getattr(item, image_field)
                        if image:
                            return request.build_absolute_uri(image.url) if request else image.url
        return None
