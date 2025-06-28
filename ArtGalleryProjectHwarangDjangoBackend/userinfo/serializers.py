
from django.contrib.auth import authenticate
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    userident = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user is None: 
            raise serializers.ValidationError('invalid credentials')
        return user
    
class UserSerializer(serializers.Serializer):
    userinfoindex1st = serializers.UUIDField()
    userident = serializers.CharField()
    userpassword = serializers.CharField()
    userpassword2nd = serializers.CharField()
    userinfoindex2nd = serializers.UUIDField()
    userinfoindex3rd = serializers.UUIDField()
    userstatus = serializers.IntegerField()
    userjoindate = serializers.DateTimeField()
