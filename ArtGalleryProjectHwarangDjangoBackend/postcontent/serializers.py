from rest_framework import serializers
from .models import Postcontent, Blogcontent, Image2D, Object3D

class BlogcontentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blogcontent
        fields = ['blogcontext']

class Image2DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image2D
        fields = ['imagefile', 'description']

class Object3DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Object3D
        fields = ['objectfile', 'description']

class PostcontentSerializer(serializers.ModelSerializer):
    # This field will dynamically serialize the related content object
    # based on its type.
    content_object = serializers.SerializerMethodField()

    class Meta:
        model = Postcontent
        fields = ['postcontentindex', 'postcontenttag', 'content_object']

    def get_content_object(self, obj):
        """
        This method checks the 'postcontenttag' and uses the
        appropriate serializer for the related content object.
        """
        tag = obj.postcontenttag
        if tag == 'blog':
            # Assuming you have a related_name='blogcontent' on the ForeignKey
            # or you can access it via blogcontent_set
            content = Blogcontent.objects.get(postcontentindex=obj.postcontentindex)
            return BlogcontentSerializer(content).data
        elif tag == 'image2d':
            content = Image2D.objects.get(postcontentindex=obj.postcontentindex)
            return Image2DSerializer(content).data
        elif tag == 'object3d':
            content = Object3D.objects.get(postcontentindex=obj.postcontentindex)
            return Object3DSerializer(content).data
        return None

    def to_representation(self, instance):
        """
        This ensures that when reading data, the content_object is included.
        """
        ret = super().to_representation(instance)
        ret['content_object'] = self.get_content_object(instance)
        return ret
