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
