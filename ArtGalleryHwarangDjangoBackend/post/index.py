from elasticsearch_dsl import AsyncDocument, Text, Keyword, Integer, Boolean, Date


class PostIndex(AsyncDocument):
    posttitle = Text(analyzer='standard')
    postdescription = Text(analyzer='standard')
    posttag = Keyword()
    author_id = Keyword()   # UUID string — exact match only
    rating = Integer()
    is_in_public = Boolean()
    created_at = Date()

    class Index:
        name = "posts"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 1,
        }

    @classmethod
    def from_post_document(cls, post: dict) -> "PostIndex":
        """Build an index entry from a post document of the MongoDB `posts` collection."""
        return cls(
            meta={"id": str(post["_id"])},
            posttitle=post["posttitle"],
            postdescription=post.get("postdescription", ""),
            posttag=post.get("posttag", []),
            author_id=str(post["author_id"]),
            rating=max((c.get("rating", 0) for c in post.get("contents", [])), default=0),
            is_in_public=post.get("is_in_public", True),
            created_at=post["created_at"],
        )
