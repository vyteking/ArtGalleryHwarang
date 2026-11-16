from rest_framework import serializers
from .models import UserInfo, UserFollowing, UserAdditionalInfo
from django.contrib.auth.hashers import make_password

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('user_index_1st', 'user_id', 'user_password', 'user_status', 'user_level', 'user_join_date')
        read_only_fields = ('user_index_1st', 'user_status', 'user_level', 'user_join_date')
        extra_kwargs = {
            'user_password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['user_password'] = make_password(validated_data['user_password'])
        return super(UserInfoSerializer, self).create(validated_data)
    
    def update(self, instance, validated_data):
        if 'user_password' in validated_data:
            validated_data['user_password'] = make_password(validated_data['user_password'])
        return super(UserInfoSerializer, self).update(instance, validated_data)

class PublicUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('user_index_1st', 'user_id')


def _media_url(request, media_field):
    """Return an absolute URL for an ImageField value, or None when empty."""
    if not media_field:
        return None
    url = media_field.url
    return request.build_absolute_uri(url) if request else url

class UserSummarySerializer(serializers.ModelSerializer):
    """Compact user card used in following / followers lists."""
    username = serializers.SerializerMethodField()
    user_profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = UserInfo
        fields = ('user_index_1st', 'user_id', 'username', 'user_profile_pic')

    def get_username(self, obj):
        additional = getattr(obj, 'useradditionalinfo', None)
        return additional.username if additional else None

    def get_user_profile_pic(self, obj):
        media = getattr(obj, 'usermediasubmission', None)
        return _media_url(self.context.get('request'), media.user_profile_pic if media else None)

class UserProfileSerializer(serializers.ModelSerializer):
    """Public profile for the user info page: basic info, additional info, media, and follow counts."""
    username = serializers.SerializerMethodField()
    user_alt_name = serializers.SerializerMethodField()
    user_description = serializers.SerializerMethodField()
    user_profile_pic = serializers.SerializerMethodField()
    user_header_image = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()

    class Meta:
        model = UserInfo
        fields = (
            'user_index_1st', 'user_id', 'user_status', 'user_level', 'user_join_date',
            'username', 'user_alt_name', 'user_description',
            'user_profile_pic', 'user_header_image',
            'following_count', 'followers_count',
        )

    def _additional(self, obj):
        return getattr(obj, 'useradditionalinfo', None)

    def _media(self, obj):
        return getattr(obj, 'usermediasubmission', None)

    def get_username(self, obj):
        additional = self._additional(obj)
        return additional.username if additional else None

    def get_user_alt_name(self, obj):
        additional = self._additional(obj)
        return additional.user_alt_name if additional else None

    def get_user_description(self, obj):
        additional = self._additional(obj)
        return additional.user_description if additional else None

    def get_user_profile_pic(self, obj):
        media = self._media(obj)
        return _media_url(self.context.get('request'), media.user_profile_pic if media else None)

    def get_user_header_image(self, obj):
        media = self._media(obj)
        return _media_url(self.context.get('request'), media.user_header_image if media else None)

    # UserFollowing.following is the followed user; UserFollowing.followed_by is the follower.
    def get_following_count(self, obj):
        return UserFollowing.objects.filter(followed_by=obj).count()

    def get_followers_count(self, obj):
        return UserFollowing.objects.filter(following=obj).count()


class UserAdditionalInfoSerializer(serializers.ModelSerializer):
    """Editable profile fields shown on the user info edit page."""
    username = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=255)
    user_alt_name = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=255)
    user_description = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = UserAdditionalInfo
        fields = ('username', 'user_alt_name', 'user_description')
