from pymongo import MongoClient
from django.conf import settings

def get_db_handle():
    """
    Returns a handle to the MongoDB database.
    """
    client = MongoClient(settings.MONGO_URI)
    db = client.get_default_database()
    return db, client

def get_collection(collection_name):
    """
    Returns a handle to a specific collection in the database.
    """
    db, client = get_db_handle()
    return db[collection_name]
