"""
MongoDB access shared by the post, postcontent, reply and sticker apps.

Posts (with their contents embedded), replies and stickers live in MongoDB;
users and everything relational stay in PostgreSQL. Documents are plain dicts
whose `_id` is the UUID that the API exposes (postindex, replyindex, ...).
Uploaded files are still saved through Django's default storage; documents
only keep the stored file name.
"""
from uuid import UUID

from django.conf import settings
from django.core.files.storage import default_storage
from django.utils import timezone
from pymongo import ASCENDING, DESCENDING, MongoClient
from rest_framework import serializers
from rest_framework.exceptions import NotFound

# Collection names
POSTS = 'posts'
REPLIES = 'replies'
MINI_STICKER_PACKAGES = 'mini_sticker_packages'
MINI_STICKERS = 'mini_stickers'
LARGE_STICKER_PACKAGES = 'large_sticker_packages'
LARGE_STICKERS = 'large_stickers'

INDEXES = {
    POSTS: [
        [('author_id', ASCENDING), ('created_at', DESCENDING)],
        [('created_at', DESCENDING), ('_id', DESCENDING)],
        [('contents.postcontentindex', ASCENDING)],
        [('posttag', ASCENDING)],
    ],
    REPLIES: [
        [('post_id', ASCENDING), ('created_at', ASCENDING)],
        [('author_id', ASCENDING)],
        [('large_sticker_id', ASCENDING)],
    ],
    MINI_STICKERS: [[('package_id', ASCENDING), ('mini_sticker_upload_date_time', ASCENDING)]],
    LARGE_STICKERS: [[('package_id', ASCENDING), ('large_sticker_upload_date_time', ASCENDING)]],
}

_client = None
_indexed = set()  # (database name, collection name) pairs whose indexes were ensured


def get_client():
    global _client
    if _client is None:
        _client = MongoClient(settings.MONGO_URI, uuidRepresentation='standard', tz_aware=True)
    return _client


def get_db():
    # MONGO_DB_NAME overrides the database named in MONGO_URI (tests use their own database).
    name = getattr(settings, 'MONGO_DB_NAME', None)
    client = get_client()
    return client[name] if name else client.get_default_database(default='hwarang')


def collection(name):
    """Return a collection, creating its indexes the first time it is used."""
    db = get_db()
    coll = db[name]
    key = (db.name, name)
    if key not in _indexed:
        for keys in INDEXES.get(name, []):
            coll.create_index(keys)
        _indexed.add(key)
    return coll


def reset_index_cache():
    _indexed.clear()


def now():
    # MongoDB keeps millisecond precision; truncate so the value we return
    # matches what is read back later.
    value = timezone.now()
    return value.replace(microsecond=value.microsecond // 1000 * 1000)


def find_or_404(name, query, projection=None):
    doc = collection(name).find_one(query, projection)
    if doc is None:
        raise NotFound()
    return doc


class MongoQuery:
    """
    A lazy, sliceable view of a find() query, so DRF pagination can count and
    slice it like a Django queryset. `transform` is applied to each document.
    """

    def __init__(self, name, query=None, sort=None, projection=None, transform=None):
        self.name = name
        self.query = query or {}
        self.sort = sort
        self.projection = projection
        self.transform = transform

    def count(self):
        return collection(self.name).count_documents(self.query)

    def __len__(self):
        return self.count()

    def _cursor(self):
        cursor = collection(self.name).find(self.query, self.projection)
        if self.sort:
            cursor = cursor.sort(self.sort)
        return cursor

    def _apply(self, docs):
        return [self.transform(doc) for doc in docs] if self.transform else list(docs)

    def __getitem__(self, index):
        if isinstance(index, slice):
            if index.step not in (None, 1):
                raise ValueError('MongoQuery does not support slice steps')
            cursor = self._cursor()
            start = index.start or 0
            if start:
                cursor = cursor.skip(start)
            if index.stop is not None:
                limit = index.stop - start
                if limit <= 0:
                    return []
                cursor = cursor.limit(limit)
            return self._apply(cursor)
        items = self[index:index + 1]
        if not items:
            raise IndexError(index)
        return items[0]

    def __iter__(self):
        return iter(self._apply(self._cursor()))


# ── Files ─────────────────────────────────────────────────────────────────────

def store_upload(uploaded_file, folder):
    """Save an uploaded file under `folder` and return its stored name ('' when there is no file)."""
    if not uploaded_file:
        return ''
    return default_storage.save(f'{folder}/{uploaded_file.name}', uploaded_file)


def delete_stored_files(names):
    for name in names:
        if name and default_storage.exists(name):
            default_storage.delete(name)


def stored_file_url(request, name):
    if not name:
        return None
    url = default_storage.url(name)
    return request.build_absolute_uri(url) if request else url


class StoredFileMixin:
    """Accept an upload on write; on read, turn a stored file name into a URL."""

    def to_representation(self, value):
        return stored_file_url(self.context.get('request'), value)


class StoredFileField(StoredFileMixin, serializers.FileField):
    pass


class StoredImageField(StoredFileMixin, serializers.ImageField):
    pass


def as_uuid(value):
    return value if isinstance(value, UUID) else UUID(str(value))
