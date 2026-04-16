from rest_framework import generics, permissions
from .models import MiniStickerPackage, MiniSticker, LargeStickerPackage, LargeSticker
from .serializers import (
    MiniStickerPackageSerializer, MiniStickerSerializer,
    LargeStickerPackageSerializer, LargeStickerSerializer,
)


# ── Mini Sticker Package ──────────────────────────────────────────────────────

class MiniStickerPackageListView(generics.ListCreateAPIView):
    """List all mini sticker packages, or create a new one (admin only)."""
    queryset = MiniStickerPackage.objects.order_by('mini_sticker_package_post_date_time')
    serializer_class = MiniStickerPackageSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class MiniStickerPackageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a mini sticker package (admin only for write)."""
    queryset = MiniStickerPackage.objects.all()
    serializer_class = MiniStickerPackageSerializer
    lookup_field = 'mini_sticker_package_index'

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


# ── Mini Sticker ──────────────────────────────────────────────────────────────

class MiniStickerListView(generics.ListCreateAPIView):
    """List all mini stickers in a package, or add a new one (admin only)."""
    serializer_class = MiniStickerSerializer

    def get_queryset(self):
        package_pk = self.kwargs['package_pk']
        return MiniSticker.objects.filter(package=package_pk).order_by('mini_sticker_upload_date_time')

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        package = MiniStickerPackage.objects.get(pk=self.kwargs['package_pk'])
        serializer.save(package=package)


class MiniStickerDetailView(generics.RetrieveDestroyAPIView):
    """Retrieve or delete a single mini sticker (admin only for delete)."""
    queryset = MiniSticker.objects.all()
    serializer_class = MiniStickerSerializer
    lookup_field = 'mini_sticker_index'

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


# ── Large Sticker Package ─────────────────────────────────────────────────────

class LargeStickerPackageListView(generics.ListCreateAPIView):
    """List all large sticker packages, or create a new one (admin only)."""
    queryset = LargeStickerPackage.objects.order_by('large_sticker_package_post_date_time')
    serializer_class = LargeStickerPackageSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class LargeStickerPackageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a large sticker package (admin only for write)."""
    queryset = LargeStickerPackage.objects.all()
    serializer_class = LargeStickerPackageSerializer
    lookup_field = 'large_sticker_package_index'

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


# ── Large Sticker ─────────────────────────────────────────────────────────────

class LargeStickerListView(generics.ListCreateAPIView):
    """List all large stickers in a package, or add a new one (admin only)."""
    serializer_class = LargeStickerSerializer

    def get_queryset(self):
        package_pk = self.kwargs['package_pk']
        return LargeSticker.objects.filter(package=package_pk).order_by('large_sticker_upload_date_time')

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        package = LargeStickerPackage.objects.get(pk=self.kwargs['package_pk'])
        serializer.save(package=package)


class LargeStickerDetailView(generics.RetrieveDestroyAPIView):
    """Retrieve or delete a single large sticker (admin only for delete)."""
    queryset = LargeSticker.objects.all()
    serializer_class = LargeStickerSerializer
    lookup_field = 'large_sticker_index'

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
