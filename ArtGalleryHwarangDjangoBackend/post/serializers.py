from rest_framework import serializers
from userinfo.models import UserInfo
from .models import Post


class PostAuthorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user_id', read_only=True)

    class Meta:
        model = UserInfo
        fields = ('username',)


class PostSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='posttitle')
    description = serializers.CharField(source='postdescription')
    tags = serializers.ListField(child=serializers.CharField(), source='posttag', default=list)
    author = PostAuthorSerializer(source='postauthor', read_only=True)

    class Meta:
        model = Post
        fields = ('postindex', 'title', 'description', 'tags',
                  'author', 'isInPublic', 'created_at', 'updated_at')
        read_only_fields = ('postindex', 'created_at', 'updated_at')
