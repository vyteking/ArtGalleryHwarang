"""
Resolve user UUIDs stored in MongoDB documents to UserInfo rows in PostgreSQL.

Serializers for Mongo documents declare `user_id_fields` (document keys that
hold user UUIDs). When such a serializer is used with many=True, the list
serializer loads every referenced user with one query instead of one per item.
"""
from rest_framework import serializers

from .models import UserInfo


class UserLookupMixin:
    user_id_fields = ()

    def get_user(self, user_id):
        """Return the UserInfo for user_id, or None if the user no longer exists."""
        if user_id is None:
            return None
        cache = self.context.setdefault('_users', {})
        if user_id not in cache:
            cache[user_id] = UserInfo.objects.filter(pk=user_id).first()
        return cache[user_id]


class UserPrefetchListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        items = list(data)
        cache = self.context.setdefault('_users', {})
        ids = {
            item.get(field)
            for item in items
            for field in self.child.user_id_fields
        } - {None} - set(cache)
        if ids:
            users = {user.pk: user for user in UserInfo.objects.filter(pk__in=ids)}
            for user_id in ids:
                cache[user_id] = users.get(user_id)
        return super().to_representation(items)
