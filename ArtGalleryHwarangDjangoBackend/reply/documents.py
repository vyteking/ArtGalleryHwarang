from beanie import Document
from pydantic import Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional
import pymongo


class Reply(Document):
    replyindex: UUID = Field(default_factory=uuid4)
    post_id: UUID           # references Post.postindex in MongoDB
    author_id: UUID         # references UserInfo.user_index_1st in PostgreSQL
    replylevel: int = 0
    replycontent: str = ""
    large_sticker_id: Optional[UUID] = None  # references LargeSticker in PostgreSQL
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "replies"
        indexes = [
            pymongo.IndexModel(
                [("post_id", pymongo.ASCENDING), ("created_at", pymongo.ASCENDING)]
            ),
            pymongo.IndexModel([("author_id", pymongo.ASCENDING)]),
        ]
