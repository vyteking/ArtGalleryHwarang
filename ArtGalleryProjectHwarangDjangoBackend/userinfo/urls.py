from django.urls import path
from .views import *

urlpatterns = [
    path('api/signup', SignupView.as_view(), name='signup'),
    path('api/login', LoginView.as_view(), name='login'),
    path('<uuid:user_index_1st>', UserPageView.as_view(), name='user-page'),
    path('<uuid:user_index_1st>/info', UserDetailView.as_view(), name='user-detail'),
    path('<uuid:user_index_1st>/update', UserUpdateView.as_view(), name='update-user'),
    path('<uuid:user_index_1st>/delete', UserDeletionView.as_view(), name='delete-user'),
]
