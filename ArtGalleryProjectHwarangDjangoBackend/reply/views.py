from rest_framework import generics, permissions
from .models import Reply
from post.models import Post as HwarangPost
from .serializers import ReplySerializer

# Custom permission to only allow owners of an object to edit it.
class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Assumes the model instance has an 'replyauthor' attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the reply.
        return obj.replyauthor == request.user


class ReplyListCreateView(generics.ListCreateAPIView):
    """
    View to list all replies for a post and create a new reply.
    """
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        This view should return a list of all the replies
        for the post as determined by the post_pk portion of the URL.
        """
        post_pk = self.kwargs['post_pk']
        return Reply.objects.filter(post__pk=post_pk)

    def perform_create(self, serializer):
        """
        This method is called when a new reply is created.
        It associates the reply with the post from the URL and the logged-in user.
        """
        post_pk = self.kwargs['post_pk']
        post = HwarangPost.objects.get(pk=post_pk)
        serializer.save(replyauthor=self.request.user, post=post)


class ReplyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or delete a single reply.
    """
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]