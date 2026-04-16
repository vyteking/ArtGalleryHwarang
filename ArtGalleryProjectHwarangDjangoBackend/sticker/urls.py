from django.urls import path
from .views import (
    MiniStickerPackageListView, MiniStickerPackageDetailView,
    MiniStickerListView, MiniStickerDetailView,
    LargeStickerPackageListView, LargeStickerPackageDetailView,
    LargeStickerListView, LargeStickerDetailView,
)

urlpatterns = [
    # Mini sticker packages
    path('mini/', MiniStickerPackageListView.as_view(), name='mini-sticker-package-list'),
    path('mini/<uuid:mini_sticker_package_index>/', MiniStickerPackageDetailView.as_view(), name='mini-sticker-package-detail'),

    # Mini stickers within a package
    path('mini/<uuid:package_pk>/stickers/', MiniStickerListView.as_view(), name='mini-sticker-list'),
    path('mini/stickers/<uuid:mini_sticker_index>/', MiniStickerDetailView.as_view(), name='mini-sticker-detail'),

    # Large sticker packages
    path('large/', LargeStickerPackageListView.as_view(), name='large-sticker-package-list'),
    path('large/<uuid:large_sticker_package_index>/', LargeStickerPackageDetailView.as_view(), name='large-sticker-package-detail'),

    # Large stickers within a package
    path('large/<uuid:package_pk>/stickers/', LargeStickerListView.as_view(), name='large-sticker-list'),
    path('large/stickers/<uuid:large_sticker_index>/', LargeStickerDetailView.as_view(), name='large-sticker-detail'),
]
