from django.urls import path
from . import views

urlpatterns = [
    # URL for listing replies for a specific post and creating a new reply
    # e.g., /api/posts/a1b2c3d4/replies/
    path('posts/<uuid:post_pk>/replies/', views.ReplyListCreateView.as_view(), name='reply-list-create'),

    # URL for retrieving, updating, or deleting a specific reply
    # e.g., /api/replies/e5f6g7h8/
    path('replies/<uuid:pk>/', views.ReplyRetrieveUpdateDestroyView.as_view(), name='reply-detail'),
]
