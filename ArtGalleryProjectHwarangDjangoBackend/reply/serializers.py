from rest_framework import serializers
from .models import Reply
from userinfo.serializers import PublicUserInfoSerializer

class ReplySerializer(serializers.ModelSerializer):
    # By default, ForeignKeys are represented by their Primary Key.
    # For replyauthor, it's often more useful to show some public details.
    # We'll make it read_only and use the PublicUserInfoSerializer.
    replyauthor = PublicUserInfoSerializer(read_only=True)

    class Meta:
        model = Reply
        fields = ['replyindex', 'replylevel', 'post', 'replyauthor', 'replycontent']
        read_only_fields = ['replyindex', 'replylevel', 'post', 'replyauthor']

    def create(self, validated_data):
        """
        Override the create method to set the author from the request context.
        """
        # Assumes the user is passed in the context from the view
        # e.g., serializer.save(replyauthor=self.context['request'].user)
        reply = Reply.objects.create(**validated_data)
        return reply
