from django.urls import path
from .views import (
    MiniStickerPackageListView, MiniStickerPackageDetailView,
    MiniStickerListView, MiniStickerDetailView,
    LargeStickerPackageListView, LargeStickerPackageDetailView,
    LargeStickerListView, LargeStickerDetailView,
)

urlpatterns = [
    # Mini sticker packages
    path('mini-sticker-packs/', MiniStickerPackageListView.as_view(), name='mini-sticker-package-list'),
    path('mini-sticker-packs/<uuid:mini_sticker_package_index>/', MiniStickerPackageDetailView.as_view(), name='mini-sticker-package-detail'),
    path('mini-sticker-packs/<uuid:package_pk>/stickers/', MiniStickerListView.as_view(), name='mini-sticker-list'),

    # Individual mini stickers
    path('mini-stickers/<uuid:mini_sticker_index>/', MiniStickerDetailView.as_view(), name='mini-sticker-detail'),

    # Large sticker packages
    path('large-sticker-packs/', LargeStickerPackageListView.as_view(), name='large-sticker-package-list'),
    path('large-sticker-packs/<uuid:large_sticker_package_index>/', LargeStickerPackageDetailView.as_view(), name='large-sticker-package-detail'),
    path('large-sticker-packs/<uuid:package_pk>/stickers/', LargeStickerListView.as_view(), name='large-sticker-list'),

    # Individual large stickers
    path('large-stickers/<uuid:large_sticker_index>/', LargeStickerDetailView.as_view(), name='large-sticker-detail'),
]
