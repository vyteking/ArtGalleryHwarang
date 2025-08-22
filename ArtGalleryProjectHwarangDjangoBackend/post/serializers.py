from rest_framework import serializers
from .models import Post 

class PostSerializer(serializers.Serializer):
    # postindex = serializers.UUIDField(read_only=True)
    # posttitle = serializers.CharField(max_length=255)
    # postauthor = serializers.CharField(max_length=255) # Assuming author id is a string
    # postdescription = serializers.CharField()
    # posttag = serializers.CharField(max_length=255)

    # The Meta class is no longer used as this is not a ModelSerializer
    class Meta:
        model = Post
        fields = '__all__'

    def create(self, validate_data):
        return super(PostSerializer, self).create(validate_data)
