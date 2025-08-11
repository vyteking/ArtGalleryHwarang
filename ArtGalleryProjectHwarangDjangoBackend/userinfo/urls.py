from django.urls import path
from .views import SignupView, LoginView, UserDetailView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/<uuid:user_index_1st>/', UserDetailView.as_view(), name='user-detail'),
]
