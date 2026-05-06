"""
ASGI config for ArtGalleryHwarang project.
Initializes Beanie (MongoDB), Redis, and Elasticsearch on startup
via the ASGI lifespan protocol.
"""

import os
from django.core.asgi import get_asgi_application
from beanie import init_beanie
from elasticsearch_dsl import async_connections
from utils import get_mongo_db
from ArtGalleryHwarang.cache import get_redis, close_redis

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ArtGalleryHwarang.settings')

django_app = get_asgi_application()


def get_beanie_documents():
    from post.documents import Post
    from reply.documents import Reply
    return [Post, Reply]


async def startup():
    from django.conf import settings

    # MongoDB via Beanie
    await init_beanie(
        database=get_mongo_db(),
        document_models=get_beanie_documents(),
    )

    # Redis
    await get_redis()

    # Elasticsearch
    async_connections.create_connection(
        hosts=[settings.ELASTICSEARCH_URI],
        alias="default",
    )


async def shutdown():
    await close_redis()


async def application(scope, receive, send):
    if scope['type'] == 'lifespan':
        while True:
            message = await receive()
            if message['type'] == 'lifespan.startup':
                await startup()
                await send({'type': 'lifespan.startup.complete'})
            elif message['type'] == 'lifespan.shutdown':
                await shutdown()
                await send({'type': 'lifespan.shutdown.complete'})
                return
    else:
        await django_app(scope, receive, send)
