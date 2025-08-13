from django.urls import path
from .views import SignupView, LoginView, UserPageView, UserDetailView

urlpatterns = [
    path('api/signup', SignupView.as_view(), name='signup'),
    path('api/login', LoginView.as_view(), name='login'),
    path('<uuid:user_index_1st>', UserPageView.as_view(), name='user-page'),
    path('<uuid:user_index_1st>/info', UserDetailView.as_view(), name='user-detail'),
]
