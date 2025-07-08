from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import UserInfo

class LoginSerializer(serializers.Serializer):
    userID = serializers.CharField()
    userpassword = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user is None: 
            raise serializers.ValidationError('invalid credentials')
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = [
            'user_index_1st',
            'user_id',
            'user_password',
            'user_password_2nd',
            'user_index_2nd',
            'user_index_3rd',
            'user_status',
            'user_level',
            'user_join_date'
        ]

    def create(self, validated_data):
        # Hash the password before saving
        user = UserInfo(**validated_data)
        user.save()
        return user

    def update(self, instance, validated_data):
        # Handle password updates carefully
        instance.user_id = validated_data.get('user_id', instance.user_id)
        instance.user_password = validated_data.get('user_password', instance.user_password)
        instance.user_password_2nd = validated_data.get('user_password_2nd', instance.user_password_2nd)
        instance.user_index_2nd = validated_data.get('user_index_2nd', instance.user_index_2nd)
        instance.user_index_3rd = validated_data.get('user_index_3rd', instance.user_index_3rd)
        instance.user_status = validated_data.get('user_status', instance.user_status)
        instance.user_level = validated_data.get('user_level', instance.user_level)
        instance.save()
        return instance
    
    def validate(self, attrs):
        return attrs
        
