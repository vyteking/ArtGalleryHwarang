from elasticsearch_dsl import AsyncDocument, Text, Keyword


class UserIndex(AsyncDocument):
    user_id = Keyword()                         # exact username match
    username = Text(analyzer='standard')        # display name full-text search
    user_alt_name = Text(analyzer='standard')   # alternate name full-text search

    class Index:
        name = "users"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 1,
        }

    @classmethod
    def from_user_model(cls, user) -> "UserIndex":
        from userinfo.models import UserAdditionalInfo
        try:
            info = UserAdditionalInfo.objects.get(user_info_index_1st=user)
        except UserAdditionalInfo.DoesNotExist:
            info = None
        return cls(
            meta={"id": str(user.user_index_1st)},
            user_id=user.user_id,
            username=info.username if info else "",
            user_alt_name=info.user_alt_name if info else "",
        )
