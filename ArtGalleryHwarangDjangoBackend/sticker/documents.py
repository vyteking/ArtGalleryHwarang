"""
Sticker packages and stickers in MongoDB. Mini and large stickers have the
same shape, with field names prefixed by their kind ('mini' or 'large'):

    <kind>_sticker_packages: {
        _id: UUID (<kind>_sticker_package_index),
        <kind>_sticker_package_name: str,
        <kind>_sticker_package_image_file: str (stored file name),
        share_range: ShareRange,
        <kind>_sticker_package_post_date_time: datetime,
    }
    <kind>_stickers: {
        _id: UUID (<kind>_sticker_index),
        package_id: UUID,
        <kind>_sticker_name: str,
        <kind>_sticker_image_file: str (stored file name),
        <kind>_sticker_upload_date_time: datetime,
    }

Mini stickers are embedded inline in reply text as {mini-sticker:<mini_sticker_index>};
large stickers are attached to a reply through its large_sticker_id.
"""
import uuid
from enum import IntEnum

from mongodb import (
    LARGE_STICKER_PACKAGES, LARGE_STICKERS, MINI_STICKER_PACKAGES, MINI_STICKERS, REPLIES,
    MongoQuery, collection, delete_stored_files, find_or_404, now, store_upload,
)

MINI = 'mini'
LARGE = 'large'

PACKAGE_COLLECTIONS = {MINI: MINI_STICKER_PACKAGES, LARGE: LARGE_STICKER_PACKAGES}
STICKER_COLLECTIONS = {MINI: MINI_STICKERS, LARGE: LARGE_STICKERS}


class ShareRange(IntEnum):
    PUBLIC = 16
    FOLLOWERS = 8
    FOLLOWING = 4
    CLOSE_FRIENDS = 2
    PRIVATE = 1


# ── Packages ──────────────────────────────────────────────────────────────────

def package_query(kind):
    return MongoQuery(PACKAGE_COLLECTIONS[kind], sort=[(f'{kind}_sticker_package_post_date_time', 1)])


def get_package(kind, package_id):
    return find_or_404(PACKAGE_COLLECTIONS[kind], {'_id': package_id})


def create_package(kind, data):
    doc = {
        '_id': uuid.uuid4(),
        f'{kind}_sticker_package_name': data[f'{kind}_sticker_package_name'],
        f'{kind}_sticker_package_image_file': store_upload(
            data[f'{kind}_sticker_package_image_file'], f'stickers/{kind}/packages'),
        'share_range': int(data.get('share_range', ShareRange.PUBLIC)),
        f'{kind}_sticker_package_post_date_time': now(),
    }
    collection(PACKAGE_COLLECTIONS[kind]).insert_one(doc)
    return doc


def update_package(kind, package, data):
    changes = {}
    name_key = f'{kind}_sticker_package_name'
    image_key = f'{kind}_sticker_package_image_file'
    if name_key in data:
        changes[name_key] = data[name_key]
    if 'share_range' in data:
        changes['share_range'] = int(data['share_range'])
    if data.get(image_key):
        changes[image_key] = store_upload(data[image_key], f'stickers/{kind}/packages')
        delete_stored_files([package.get(image_key)])
    if changes:
        collection(PACKAGE_COLLECTIONS[kind]).update_one({'_id': package['_id']}, {'$set': changes})
        package.update(changes)
    return package


def delete_package(kind, package):
    stickers = list(collection(STICKER_COLLECTIONS[kind]).find({'package_id': package['_id']}))
    _delete_stickers(kind, stickers)
    collection(PACKAGE_COLLECTIONS[kind]).delete_one({'_id': package['_id']})
    delete_stored_files([package.get(f'{kind}_sticker_package_image_file')])


# ── Stickers ──────────────────────────────────────────────────────────────────

def sticker_query(kind, package_id):
    return MongoQuery(
        STICKER_COLLECTIONS[kind], {'package_id': package_id},
        sort=[(f'{kind}_sticker_upload_date_time', 1)],
    )


def stickers_of_package(kind, package_id):
    return list(sticker_query(kind, package_id))


def get_sticker(kind, sticker_id):
    return find_or_404(STICKER_COLLECTIONS[kind], {'_id': sticker_id})


def find_sticker(kind, sticker_id):
    return collection(STICKER_COLLECTIONS[kind]).find_one({'_id': sticker_id})


def create_sticker(kind, package_id, data):
    doc = {
        '_id': uuid.uuid4(),
        'package_id': package_id,
        f'{kind}_sticker_name': data[f'{kind}_sticker_name'],
        f'{kind}_sticker_image_file': store_upload(data[f'{kind}_sticker_image_file'], f'stickers/{kind}'),
        f'{kind}_sticker_upload_date_time': now(),
    }
    collection(STICKER_COLLECTIONS[kind]).insert_one(doc)
    return doc


def delete_sticker(kind, sticker):
    _delete_stickers(kind, [sticker])


def _delete_stickers(kind, stickers):
    if not stickers:
        return
    ids = [sticker['_id'] for sticker in stickers]
    if kind == LARGE:
        # Replies keep their text when their large sticker is removed (formerly on_delete=SET_NULL).
        collection(REPLIES).update_many({'large_sticker_id': {'$in': ids}}, {'$set': {'large_sticker_id': None}})
    collection(STICKER_COLLECTIONS[kind]).delete_many({'_id': {'$in': ids}})
    delete_stored_files(sticker.get(f'{kind}_sticker_image_file') for sticker in stickers)
