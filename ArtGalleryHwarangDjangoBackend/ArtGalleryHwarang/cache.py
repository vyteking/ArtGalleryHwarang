import json
from redis.asyncio import Redis
from django.conf import settings

_redis: Redis | None = None


async def get_redis() -> Redis:
    global _redis
    if _redis is None:
        _redis = Redis.from_url(settings.REDIS_URI, decode_responses=True)
    return _redis


async def close_redis():
    global _redis
    if _redis:
        await _redis.aclose()
        _redis = None


# User cache helpers — keyed by UserInfo.user_index_1st UUID

async def get_cached_user(user_uuid: str) -> dict | None:
    redis = await get_redis()
    data = await redis.get(f"user:{user_uuid}")
    return json.loads(data) if data else None


async def set_cached_user(user_uuid: str, data: dict, ttl: int = 300):
    redis = await get_redis()
    await redis.set(f"user:{user_uuid}", json.dumps(data), ex=ttl)


async def invalidate_cached_user(user_uuid: str):
    redis = await get_redis()
    await redis.delete(f"user:{user_uuid}")


# Rate limiting helper — returns remaining attempts

async def check_rate_limit(key: str, limit: int, window: int) -> int:
    redis = await get_redis()
    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, window)
    return max(0, limit - count)
