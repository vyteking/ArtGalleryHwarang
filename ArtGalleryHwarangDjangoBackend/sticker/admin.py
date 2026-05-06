from django.contrib import admin
from .models import MiniStickerPackage, MiniSticker, LargeStickerPackage, LargeSticker

admin.site.register(MiniStickerPackage)
admin.site.register(MiniSticker)
admin.site.register(LargeStickerPackage)
admin.site.register(LargeSticker)
