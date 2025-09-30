from rest_framework import serializers
from .models import Postcontent, Blogcontent, Image2D, Object3D

class BlogcontentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blogcontent
        fields = '__all__'

class Image2DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image2D
        fields = '__all__'

class Object3DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Object3D
        fields = '__all__'

class PostcontentSerializer(serializers.ModelSerializer):
    blogcontent = BlogcontentSerializer(many=True, read_only=True)
    image2d = Image2DSerializer(many=True, read_only=True)
    object3d = Object3DSerializer(many=True, read_only=True)

    class Meta:
        model = Postcontent
        fields = ('postcontentindex', 'postindex', 'postcontenttag', 'blogcontent', 'image2d', 'object3d')