"""
Replies in the MongoDB `replies` collection:

    {
        _id: UUID (replyindex),
        post_id: UUID (posts._id),
        author_id: UUID (UserInfo.user_index_1st in PostgreSQL),
        replylevel: int,
        replycontent: str,          # mini stickers are inline as {mini-sticker:<uuid>}
        large_sticker_id: UUID | None (large_stickers._id),
        created_at: datetime,
    }
"""
import uuid

from mongodb import REPLIES, MongoQuery, collection, find_or_404, now


def replies_of_post(post_id):
    return MongoQuery(REPLIES, {'post_id': post_id}, sort=[('created_at', 1), ('_id', 1)])


def get_reply(replyindex):
    return find_or_404(REPLIES, {'_id': replyindex})


def create_reply(post_id, author_id, data):
    doc = {
        '_id': uuid.uuid4(),
        'post_id': post_id,
        'author_id': author_id,
        'replylevel': 0,
        'replycontent': data.get('replycontent', ''),
        'large_sticker_id': data.get('large_sticker_id'),
        'created_at': now(),
    }
    collection(REPLIES).insert_one(doc)
    return doc


def update_reply(reply, data):
    changes = {key: data[key] for key in ('replycontent', 'large_sticker_id') if key in data}
    if changes:
        collection(REPLIES).update_one({'_id': reply['_id']}, {'$set': changes})
        reply.update(changes)
    return reply


def delete_reply(reply):
    collection(REPLIES).delete_one({'_id': reply['_id']})
