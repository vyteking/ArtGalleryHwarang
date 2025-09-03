from django.urls import path
from .views import *

urlpatterns = [
    path('api/add', SubmitPostContentView.as_view(), name='add-post-content'),
    path('<uuid:postcontentindex>', PostContentView.as_view(), name='post-content'),
    path('<uuid:postcontentindex>/delete', DeletePostView.as_view(), name='delete-post-content'),
]
