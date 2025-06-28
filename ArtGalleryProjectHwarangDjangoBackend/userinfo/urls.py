from django.urls import path
from .views import beginView

urlpatterns = [
    path('api/login/', beginView.as_view(), name='login'),
]