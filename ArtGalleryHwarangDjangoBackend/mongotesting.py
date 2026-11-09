"""Test helpers: run each test against an empty MongoDB database and a temporary media folder."""
import shutil
import tempfile
from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from PIL import Image

from mongodb import get_client, reset_index_cache

TEST_MONGO_DB_NAME = 'test_hwarang'


class MongoTestMixin:
    def setUp(self):
        super().setUp()
        media_root = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, media_root, ignore_errors=True)
        overrides = override_settings(MONGO_DB_NAME=TEST_MONGO_DB_NAME, MEDIA_ROOT=media_root)
        overrides.enable()
        self.addCleanup(overrides.disable)
        self.drop_mongo_db()
        self.addCleanup(self.drop_mongo_db)

    @staticmethod
    def drop_mongo_db():
        get_client().drop_database(TEST_MONGO_DB_NAME)
        reset_index_cache()


def image_upload(name='image.png'):
    buffer = BytesIO()
    Image.new('RGB', (2, 2), 'white').save(buffer, 'PNG')
    return SimpleUploadedFile(name, buffer.getvalue(), content_type='image/png')
