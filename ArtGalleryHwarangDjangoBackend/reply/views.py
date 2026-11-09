from rest_framework import generics, permissions

from post.documents import get_post
from . import documents
from .serializers import ReplySerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Only allow the author of a reply to edit or delete it."""
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the reply.
        return obj['author_id'] == request.user.pk


class ReplyListCreateView(generics.ListCreateAPIView):
    """
    View to list all replies for a post and create a new reply.
    """
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # postview.tsx expects a plain list of replies.
    pagination_class = None

    def get_queryset(self):
        """Replies of the post named by the post_pk portion of the URL, oldest first."""
        return documents.replies_of_post(self.kwargs['post_pk'])

    def perform_create(self, serializer):
        """Associate the new reply with the post from the URL and the logged-in user."""
        post = get_post(self.kwargs['post_pk'], {'_id': 1})
        serializer.save(author_id=self.request.user.pk, post_id=post['_id'])


class ReplyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a single reply.
    """
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_object(self):
        reply = documents.get_reply(self.kwargs['pk'])
        self.check_object_permissions(self.request, reply)
        return reply

    def perform_destroy(self, instance):
        documents.delete_reply(instance)
