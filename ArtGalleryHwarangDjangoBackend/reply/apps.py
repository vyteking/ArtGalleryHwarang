from django.apps import AppConfig


class ReplyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reply'

    def ready(self):
        from django.conf import settings
        from django.db.models.signals import post_delete

        post_delete.connect(delete_user_replies, sender=settings.AUTH_USER_MODEL,
                            dispatch_uid='reply.delete_user_replies')


def delete_user_replies(sender, instance, **kwargs):
    """Replies live in MongoDB, so a deleted user's replies are removed here instead of by a foreign key cascade."""
    from mongodb import REPLIES, collection
    collection(REPLIES).delete_many({'author_id': instance.pk})
