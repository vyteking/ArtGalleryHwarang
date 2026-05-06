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
    def from_post_document(cls, post) -> "PostIndex":
        return cls(
            meta={"id": str(post.postindex)},
            posttitle=post.posttitle,
            postdescription=post.postdescription,
            posttag=post.posttag,
            author_id=str(post.author_id),
            rating=max((c.rating for c in post.contents), default=0),
            is_in_public=post.is_in_public,
            created_at=post.created_at,
        )
