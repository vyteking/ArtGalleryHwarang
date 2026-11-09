from django.apps import AppConfig


class PostConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'post'

    def ready(self):
        from django.conf import settings
        from django.db.models.signals import post_delete

        post_delete.connect(delete_user_posts, sender=settings.AUTH_USER_MODEL,
                            dispatch_uid='post.delete_user_posts')


def delete_user_posts(sender, instance, **kwargs):
    """Posts live in MongoDB, so a deleted user's posts are removed here instead of by a foreign key cascade."""
    from .documents import delete_posts
    delete_posts({'author_id': instance.pk})
