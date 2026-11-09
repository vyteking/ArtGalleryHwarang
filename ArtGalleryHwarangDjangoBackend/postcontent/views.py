from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from post.documents import get_post
from . import documents
from .serializers import (
    PostcontentSerializer, BlogcontentSerializer, Image2DSerializer, Animation2DSerializer,
    Object3DSerializer, AudioSerializer, VideoSerializer, with_postindex,
)


def require_post_owner(request, post):
    if post['author_id'] != request.user.pk:
        raise PermissionDenied('Only the author of the post can change its contents.')


class PostContentView(generics.RetrieveAPIView):
    serializer_class = PostcontentSerializer

    def get_object(self):
        post, content = documents.get_post_with_content(self.kwargs['postcontentindex'])
        return with_postindex(post['_id'], content)


class PostContentListByPostView(generics.ListAPIView):
    serializer_class = PostcontentSerializer
    # A post's contents come from one embedded array, and postview.tsx expects a plain list.
    pagination_class = None

    def get_queryset(self):
        post = get_post(self.kwargs['postindex'], {'contents': 1})
        return [with_postindex(post['_id'], content) for content in post.get('contents', [])]


class SubmitPostContentView(generics.CreateAPIView):
    serializer_class = PostcontentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post = get_post(serializer.validated_data['postindex'], {'author_id': 1})
        require_post_owner(self.request, post)
        serializer.save()


class DeletePostContentView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        post, content = documents.get_post_with_content(self.kwargs['postcontentindex'])
        require_post_owner(request, post)
        documents.delete_content(post['_id'], content)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SubmitContentItemView(generics.CreateAPIView):
    """Add an item (blog text, image, 3D object, ...) to an existing content of the user's own post."""
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post, _content = documents.get_post_with_content(serializer.validated_data['postcontentindex'])
        require_post_owner(self.request, post)
        serializer.save(post_id=post['_id'])


class SubmitBlogcontentView(SubmitContentItemView):
    serializer_class = BlogcontentSerializer


class SubmitImage2DView(SubmitContentItemView):
    serializer_class = Image2DSerializer


class SubmitAnimation2DView(SubmitContentItemView):
    serializer_class = Animation2DSerializer


class SubmitObject3DView(SubmitContentItemView):
    serializer_class = Object3DSerializer


class SubmitAudioView(SubmitContentItemView):
    serializer_class = AudioSerializer


class SubmitVideoView(SubmitContentItemView):
    serializer_class = VideoSerializer
