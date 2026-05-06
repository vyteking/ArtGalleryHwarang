from beanie import Document
from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from enum import IntEnum
from typing import Optional, Annotated, Union
import pymongo


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


# Embedded content types — discriminated by content_type field

class BlogContent(BaseModel):
    content_type: str = "blog"
    blogtext: str


class Image2DContent(BaseModel):
    content_type: str = "image2d"
    file_url: str
    description: str = ""


class Animation2DContent(BaseModel):
    content_type: str = "animation2d"
    file_url: str
    animation_format: str = ""
    description: str = ""


class Object3DContent(BaseModel):
    content_type: str = "object3d"
    file_url: str
    description: str = ""


class AudioContent(BaseModel):
    content_type: str = "audio"
    file_url: str
    duration: Optional[int] = None
    description: str = ""


class VideoContent(BaseModel):
    content_type: str = "video"
    file_url: str = ""
    embed_url: str = ""
    duration: Optional[int] = None
    description: str = ""


ContentData = Annotated[
    Union[
        BlogContent,
        Image2DContent,
        Animation2DContent,
        Object3DContent,
        AudioContent,
        VideoContent,
    ],
    Field(discriminator="content_type"),
]


class PostContent(BaseModel):
    postcontentindex: UUID = Field(default_factory=uuid4)
    postcontenttag: str = ""
    rating: Rating = Rating.GENERAL
    show_range: ShowRange = ShowRange.PUBLIC
    data: ContentData
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Post(Document):
    postindex: UUID = Field(default_factory=uuid4)
    posttitle: str
    author_id: UUID  # references UserInfo.user_index_1st in PostgreSQL
    postdescription: str = ""
    posttag: str = ""
    is_in_public: bool = True
    contents: list[PostContent] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "posts"
        indexes = [
            pymongo.IndexModel([("author_id", pymongo.ASCENDING)]),
            pymongo.IndexModel([("created_at", pymongo.DESCENDING)]),
            pymongo.IndexModel([("posttag", pymongo.TEXT)]),
        ]
