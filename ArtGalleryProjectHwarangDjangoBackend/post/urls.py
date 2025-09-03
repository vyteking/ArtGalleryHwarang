from django.urls import path
from .views import *

urlpatterns = [
    path('api/posts', PostListView.as_view(), name='post-list'),
    path('api/submit', SubmitPostView.as_view(), name='submit-post'),
    path('u/<uuid:postauthor>', PostListView.as_view(), name='user-post-list'),
    path('<uuid:postindex>', PostListView.as_view(), name='post-view'),
    path('<uuid:postindex>/update', UpdatePostView.as_view(), name='update-post'),
    path('<uuid:postindex>/delete', DeletePostView.as_view(), name='delete-post'),
]
