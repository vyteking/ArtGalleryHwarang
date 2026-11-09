from rest_framework import generics, permissions

from . import documents
from .documents import LARGE, MINI
from .serializers import (
    MiniStickerPackageSerializer, MiniStickerSerializer,
    LargeStickerPackageSerializer, LargeStickerSerializer,
)


class AdminWriteMixin:
    """Anyone may read; only admins may create, update or delete."""
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class StickerPackageListView(AdminWriteMixin, generics.ListCreateAPIView):
    kind = None

    def get_queryset(self):
        return documents.package_query(self.kind)


class StickerPackageDetailView(AdminWriteMixin, generics.RetrieveUpdateDestroyAPIView):
    kind = None

    def get_object(self):
        package = documents.get_package(self.kind, self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, package)
        return package

    def perform_destroy(self, instance):
        documents.delete_package(self.kind, instance)


class StickerListView(AdminWriteMixin, generics.ListCreateAPIView):
    kind = None

    def get_queryset(self):
        return documents.sticker_query(self.kind, self.kwargs['package_pk'])

    def perform_create(self, serializer):
        package = documents.get_package(self.kind, self.kwargs['package_pk'])
        serializer.save(package_id=package['_id'])


class StickerDetailView(AdminWriteMixin, generics.RetrieveDestroyAPIView):
    kind = None

    def get_object(self):
        sticker = documents.get_sticker(self.kind, self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, sticker)
        return sticker

    def perform_destroy(self, instance):
        documents.delete_sticker(self.kind, instance)


# ── Mini stickers ─────────────────────────────────────────────────────────────

class MiniStickerPackageListView(StickerPackageListView):
    """List all mini sticker packages, or create a new one (admin only)."""
    kind = MINI
    serializer_class = MiniStickerPackageSerializer


class MiniStickerPackageDetailView(StickerPackageDetailView):
    """Retrieve, update, or delete a mini sticker package (admin only for write)."""
    kind = MINI
    serializer_class = MiniStickerPackageSerializer
    lookup_field = 'mini_sticker_package_index'


class MiniStickerListView(StickerListView):
    """List all mini stickers in a package, or add a new one (admin only)."""
    kind = MINI
    serializer_class = MiniStickerSerializer


class MiniStickerDetailView(StickerDetailView):
    """Retrieve or delete a single mini sticker (admin only for delete)."""
    kind = MINI
    serializer_class = MiniStickerSerializer
    lookup_field = 'mini_sticker_index'


# ── Large stickers ────────────────────────────────────────────────────────────

class LargeStickerPackageListView(StickerPackageListView):
    """List all large sticker packages, or create a new one (admin only)."""
    kind = LARGE
    serializer_class = LargeStickerPackageSerializer


class LargeStickerPackageDetailView(StickerPackageDetailView):
    """Retrieve, update, or delete a large sticker package (admin only for write)."""
    kind = LARGE
    serializer_class = LargeStickerPackageSerializer
    lookup_field = 'large_sticker_package_index'


class LargeStickerListView(StickerListView):
    """List all large stickers in a package, or add a new one (admin only)."""
    kind = LARGE
    serializer_class = LargeStickerSerializer


class LargeStickerDetailView(StickerDetailView):
    """Retrieve or delete a single large sticker (admin only for delete)."""
    kind = LARGE
    serializer_class = LargeStickerSerializer
    lookup_field = 'large_sticker_index'
