"""
Post documents in the MongoDB `posts` collection.

    {
        _id: UUID (postindex),
        posttitle, postdescription: str,
        author_id: UUID (UserInfo.user_index_1st in PostgreSQL),
        posttag: [str],
        is_in_public: bool,
        contents: [content, ...],     # see postcontent/documents.py
        created_at, updated_at: datetime,
    }
"""
import uuid
from enum import IntEnum

from mongodb import POSTS, REPLIES, collection, delete_stored_files, find_or_404, now


class Rating(IntEnum):
    GENERAL = 0
    MILD = 1
    QUESTIONABLE = 2
    EXPLICIT = 3


class ShowRange(IntEnum):
    PRIVATE = 0
    PATRONS = 1
    CLOSE_FRIENDS = 2
    FOLLOWING = 4
    FOLLOWERS = 8
    PUBLIC = 16


# Content item lists embedded in each content, and the fields of each item that hold stored files.
CONTENT_FILE_FIELDS = {
    'blogcontent': ('thumbnailimagefile',),
    'image2d': ('imagefile', 'thumbnailimagefile'),
    'animation2d': ('animationfile', 'thumbnailimagefile'),
    'object3d': ('objectfile', 'thumbnailimagefile'),
    'audio': ('audiofile', 'thumbnailimagefile', 'albumimagefile'),
    'video': ('videofile', 'thumbnailimagefile'),
}

NEWEST_FIRST = [('created_at', -1), ('_id', -1)]

# Posts are listed without their (possibly large) contents unless needed.
WITHOUT_CONTENTS = {'contents': 0}


def get_post(postindex, projection=None):
    return find_or_404(POSTS, {'_id': postindex}, projection)


def create_post(author_id, data):
    timestamp = now()
    doc = {
        '_id': uuid.uuid4(),
        'posttitle': data['posttitle'],
        'author_id': author_id,
        'postdescription': data.get('postdescription', ''),
        'posttag': list(data.get('posttag', [])),
        'is_in_public': data.get('is_in_public', True),
        'contents': [],
        'created_at': timestamp,
        'updated_at': timestamp,
    }
    collection(POSTS).insert_one(doc)
    return doc


def update_post(post, data):
    changes = {key: data[key] for key in ('posttitle', 'postdescription', 'posttag', 'is_in_public') if key in data}
    changes['updated_at'] = now()
    collection(POSTS).update_one({'_id': post['_id']}, {'$set': changes})
    post.update(changes)
    return post


def adjacent_postindex(post, direction):
    """postindex of the previous ('prev') or next ('next') post by creation time, or None.

    Ties on created_at (MongoDB keeps milliseconds) are broken by _id, matching NEWEST_FIRST.
    """
    op, order = ('$lt', -1) if direction == 'prev' else ('$gt', 1)
    query = {'$or': [
        {'created_at': {op: post['created_at']}},
        {'created_at': post['created_at'], '_id': {op: post['_id']}},
    ]}
    found = collection(POSTS).find_one(query, {'_id': 1}, sort=[('created_at', order), ('_id', order)])
    return found['_id'] if found else None


def content_file_names(content):
    return [
        item.get(field)
        for content_type, fields in CONTENT_FILE_FIELDS.items()
        for item in content.get(content_type, [])
        for field in fields
    ]


def delete_posts(query):
    """Delete matching posts, their replies and their uploaded files."""
    posts = list(collection(POSTS).find(query, {'_id': 1, 'contents': 1}))
    if not posts:
        return
    post_ids = [post['_id'] for post in posts]
    collection(REPLIES).delete_many({'post_id': {'$in': post_ids}})
    collection(POSTS).delete_many({'_id': {'$in': post_ids}})
    delete_stored_files(
        name for post in posts for content in post.get('contents', []) for name in content_file_names(content)
    )


def delete_post(post):
    delete_posts({'_id': post['_id']})
