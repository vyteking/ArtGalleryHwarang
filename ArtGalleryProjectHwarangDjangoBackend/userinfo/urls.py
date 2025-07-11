from django.urls import path
from .views import UserInfoViewset
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('u', UserInfoViewset, 'u')
urlpatterns = router.urls
urlpatterns = [
    path('api/login/', UserInfoViewset.retrieve.as_view(), name='login'),
    # path('api/signup/')
]