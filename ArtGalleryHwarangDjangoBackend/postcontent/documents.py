"""
Post contents, embedded in their post's `contents` array in MongoDB:

    {
        postcontentindex: UUID,
        postcontenttitle, postcontenttag: str,
        rating: Rating, show_range: ShowRange,
        created_at, updated_at: datetime,
        blogcontent: [{id, thumbnailimagefile, blogcontext}],
        image2d:     [{id, imagefile, thumbnailimagefile, description}],
        animation2d: [{id, animationfile, animationformat, thumbnailimagefile, description}],
        object3d:    [{id, objectfile, thumbnailimagefile, description}],
        audio:       [{id, audiofile, duration, thumbnailimagefile, albumimagefile, description}],
        video:       [{id, videofile, embed_url, thumbnailimagefile, duration, description}],
    }

File fields hold names in Django's default storage, saved under
<postindex>/<postcontentindex>/<folder>/<filename> as before.
"""
import uuid

from rest_framework.exceptions import NotFound

from mongodb import POSTS, collection, delete_stored_files, now
from post.documents import CONTENT_FILE_FIELDS, Rating, ShowRange, content_file_names

CONTENT_TYPES = tuple(CONTENT_FILE_FIELDS)


def get_post_with_content(postcontentindex):
    """Return (post, content) for a content index; the post only carries _id, author_id and that content."""
    post = collection(POSTS).find_one(
        {'contents.postcontentindex': postcontentindex},
        {'author_id': 1, 'contents.$': 1},
    )
    if post is None:
        raise NotFound()
    return post, post['contents'][0]


def add_content(post_id, data):
    timestamp = now()
    content = {
        'postcontentindex': uuid.uuid4(),
        'postcontenttitle': data.get('postcontenttitle', ''),
        'postcontenttag': data.get('postcontenttag', ''),
        'rating': int(data.get('rating', Rating.GENERAL)),
        'show_range': int(data.get('show_range', ShowRange.PUBLIC)),
        'created_at': timestamp,
        'updated_at': timestamp,
        **{content_type: [] for content_type in CONTENT_TYPES},
    }
    collection(POSTS).update_one({'_id': post_id}, {'$push': {'contents': content}})
    return content


def add_content_item(postcontentindex, content_type, item):
    item = {'id': uuid.uuid4(), **item}
    collection(POSTS).update_one(
        {'contents.postcontentindex': postcontentindex},
        {
            '$push': {f'contents.$.{content_type}': item},
            '$set': {'contents.$.updated_at': now()},
        },
    )
    return item


def delete_content(post_id, content):
    collection(POSTS).update_one(
        {'_id': post_id},
        {'$pull': {'contents': {'postcontentindex': content['postcontentindex']}}},
    )
    delete_stored_files(content_file_names(content))
