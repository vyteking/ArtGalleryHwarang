from rest_framework import serializers

from mongodb import StoredFileField, StoredImageField, store_upload
from post.documents import Rating, ShowRange
from . import documents


class ContentItemSerializer(serializers.Serializer):
    """
    Base for the items embedded in a content (blog text, images, 3D objects, ...).
    Subclasses set `content_type` (the item list name) and `upload_folders`
    (file field -> folder under <postindex>/<postcontentindex>/).
    """
    content_type = None
    upload_folders = {}

    id = serializers.UUIDField(read_only=True)
    postcontentindex = serializers.UUIDField()

    def create(self, validated_data):
        post_id = validated_data.pop('post_id')
        postcontentindex = validated_data.pop('postcontentindex')
        item = {}
        for name, field in self.fields.items():
            if field.read_only or name == 'postcontentindex':
                continue
            value = validated_data.get(name)
            if name in self.upload_folders:
                value = store_upload(value, f'{post_id}/{postcontentindex}/{self.upload_folders[name]}')
            elif value is None and not isinstance(field, serializers.IntegerField):
                value = ''
            item[name] = value
        item = documents.add_content_item(postcontentindex, self.content_type, item)
        return {**item, 'postcontentindex': postcontentindex}


class BlogcontentSerializer(ContentItemSerializer):
    content_type = 'blogcontent'
    upload_folders = {'thumbnailimagefile': 'blogcontent/thumbnail'}

    thumbnailimagefile = StoredImageField(required=False)
    blogcontext = serializers.CharField()


class Image2DSerializer(ContentItemSerializer):
    content_type = 'image2d'
    upload_folders = {'imagefile': 'image2d', 'thumbnailimagefile': 'image2d/thumbnail'}

    imagefile = StoredImageField()
    thumbnailimagefile = StoredImageField(required=False)
    description = serializers.CharField(allow_blank=True, required=False)


class Animation2DSerializer(ContentItemSerializer):
    content_type = 'animation2d'
    upload_folders = {'animationfile': 'animation2d', 'thumbnailimagefile': 'animation2d/thumbnail'}

    animationfile = StoredFileField()
    animationformat = serializers.CharField(max_length=63, allow_blank=True, required=False)
    thumbnailimagefile = StoredImageField(required=False)
    description = serializers.CharField(allow_blank=True, required=False)


class Object3DSerializer(ContentItemSerializer):
    content_type = 'object3d'
    upload_folders = {'objectfile': 'object3d', 'thumbnailimagefile': 'object3d/thumbnail'}

    objectfile = StoredFileField()
    thumbnailimagefile = StoredImageField(required=False)
    description = serializers.CharField()


class AudioSerializer(ContentItemSerializer):
    content_type = 'audio'
    upload_folders = {
        'audiofile': 'audio',
        'thumbnailimagefile': 'audio/thumbnail',
        'albumimagefile': 'audio/albumthumbnail',
    }

    audiofile = StoredFileField()
    duration = serializers.IntegerField(min_value=0, allow_null=True, required=False)
    thumbnailimagefile = StoredImageField(required=False)
    albumimagefile = StoredImageField(required=False)
    description = serializers.CharField(allow_blank=True, required=False)


class VideoSerializer(ContentItemSerializer):
    content_type = 'video'
    upload_folders = {'videofile': 'video', 'thumbnailimagefile': 'video/thumbnail'}

    videofile = StoredFileField(required=False)
    embed_url = serializers.URLField(max_length=511, allow_blank=True, required=False)
    thumbnailimagefile = StoredImageField(required=False)
    duration = serializers.IntegerField(min_value=0, allow_null=True, required=False)
    description = serializers.CharField(allow_blank=True, required=False)


ITEM_SERIALIZERS = {
    serializer.content_type: serializer
    for serializer in (
        BlogcontentSerializer, Image2DSerializer, Animation2DSerializer,
        Object3DSerializer, AudioSerializer, VideoSerializer,
    )
}


class PostcontentSerializer(serializers.Serializer):
    """
    A content of a post. The instance is the embedded content dict plus `postindex`
    (the parent post's id), as produced by `with_postindex()`.
    """
    postcontentindex = serializers.UUIDField(read_only=True)
    postindex = serializers.UUIDField()
    postcontenttitle = serializers.CharField(allow_blank=True, required=False)
    postcontenttag = serializers.CharField(max_length=255, allow_blank=True, required=False)
    rating = serializers.ChoiceField(choices=[r.value for r in Rating], default=Rating.GENERAL.value)
    show_range = serializers.ChoiceField(choices=[s.value for s in ShowRange], default=ShowRange.PUBLIC.value)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for content_type, serializer in ITEM_SERIALIZERS.items():
            items = [
                {**item, 'postcontentindex': instance['postcontentindex']}
                for item in instance.get(content_type, [])
            ]
            data[content_type] = serializer(items, many=True, context=self.context).data
        return data

    def create(self, validated_data):
        post_id = validated_data.pop('postindex')
        return with_postindex(post_id, documents.add_content(post_id, validated_data))


def with_postindex(post_id, content):
    return {**content, 'postindex': post_id}
