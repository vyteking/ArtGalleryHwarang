from django.urls import path
from .views import *

urlpatterns = [
    path('api/add', SubmitPostContentView.as_view(), name='add-post-content'),
    path('<uuid:postcontentindex>', PostContentView.as_view(), name='post-content'),
    path('<uuid:postcontentindex>/delete', DeletePostContentView.as_view(), name='delete-post-content'),
    path('api/add/blog', SubmitBlogcontentView.as_view(), name='add-blog-content'),
    path('api/add/image2d', SubmitImage2DView.as_view(), name='add-image2d-content'),
    path('api/add/object3d', SubmitObject3DView.as_view(), name='add-object3d-content'),
]