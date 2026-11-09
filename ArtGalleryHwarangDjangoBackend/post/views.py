from rest_framework import generics, permissions

from mongodb import POSTS, MongoQuery, as_uuid
from . import documents
from .serializers import PostSerializer, PostGallerySerializer, GALLERY_CONTENT_TYPES


class IsPostOwner(permissions.BasePermission):
    """Allow write access only to the post's author."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj['author_id'] == request.user.pk


class PostObjectMixin:
    """Look up the post document named by the URL's postindex and check object permissions."""
    lookup_field = 'postindex'
    post_projection = documents.WITHOUT_CONTENTS

    def get_object(self):
        post = documents.get_post(self.kwargs[self.lookup_field], self.post_projection)
        self.check_object_permissions(self.request, post)
        return post


class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        return MongoQuery(POSTS, sort=documents.NEWEST_FIRST, projection=documents.WITHOUT_CONTENTS)


class PostDetailView(PostObjectMixin, generics.RetrieveAPIView):
    serializer_class = PostSerializer


class PostByUserView(generics.ListAPIView):
    serializer_class = PostGallerySerializer

    def get_queryset(self):
        postauthor = as_uuid(self.kwargs['postauthor'])
        query = {'author_id': postauthor}
        # Private posts are only listed for their author.
        if self.request.user.pk != postauthor:
            query['is_in_public'] = True
        # Optional submission type filter for the gallery tabs, e.g. ?type=image2d
        content_type = self.request.query_params.get('type')
        if content_type in GALLERY_CONTENT_TYPES:
            query[f'contents.{content_type}.0'] = {'$exists': True}
        return MongoQuery(POSTS, query, sort=documents.NEWEST_FIRST)


class SubmitPostView(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author_id=self.request.user.pk)


class UpdatePostView(PostObjectMixin, generics.UpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated, IsPostOwner]


class DeletePostView(PostObjectMixin, generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPostOwner]
    post_projection = {'author_id': 1}

    def perform_destroy(self, instance):
        documents.delete_post(instance)
