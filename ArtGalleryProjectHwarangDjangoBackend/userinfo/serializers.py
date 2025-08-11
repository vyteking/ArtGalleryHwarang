from rest_framework import serializers
from .models import UserInfo
from django.contrib.auth.hashers import make_password

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('user_index_1st', 'user_id', 'user_password', 'user_index_2nd', 'user_index_3rd')
        read_only_fields = ('user_index_1st', 'user_index_2nd', 'user_index_3rd')
        extra_kwargs = {
            'user_password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['user_password'] = make_password(validated_data['user_password'])
        return super(UserInfoSerializer, self).create(validated_data)

class PublicUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('user_index_1st', 'user_id')
