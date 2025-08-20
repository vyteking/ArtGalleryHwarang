from django.urls import path
from .views import PostListView

urlpatterns = [
    path('api/posts/', PostListView.as_view(), name='post-list'),
    path('api/submit', PostListView.as_view(), name='post-list'),
]
