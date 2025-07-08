from pymongo import MongoClient
from pymongo.errors import ConnectionError, AuthenticationError

def get_collection(col_name, db_name='hwarangtestserver', host='mongodb://localhost:27017'):
    try:
        client = MongoClient(host)
        db_handle = client[db_name]
        db_col = db_handle[col_name]
        return db_col
    except ConnectionError as e:
        print(f"Could not connect to MongoDB: {e}")
        return None
    except AuthenticationError as e:
        print(f"Authentication failed: {e}")
        return None

def get_db_handle(db_name, host, port, username, password):
    try:
        client = MongoClient(host=host, 
                            port=int(port), 
                            username=username,
                            password=password
                            )
        db_handle = client[db_name]

        return db_handle, client
    except ConnectionError as e:
        print(f"Could not connect to MongoDB: {e}")
        return None, None
    except AuthenticationError as e:
        print(f"Authentication failed: {e}")
        return None, None
    
if __name__ == "__main__":
    db_name = "hwarangtestserver"
    host = "localhost"
    port = 27017
    username = "hwarangadmin"
    password = "password"

    db_handle, client = get_db_handle(db_name, host, port, username, password)

    if db_handle:
        print("Connected to the database!")
    else:
        print("Failed to connect to the database.")

def GetMongoDBCollections(host, db_name):
    try:
        client = MongoClient(host)
        db_handle = client[db_name]
        print(db_handle.list_collection_names)
    except ConnectionError as e:
        print(f"Could not connect to MongoDB: {e}")
        return None
    except AuthenticationError as e:
        print(f"Authentication failed: {e}")
        return None
    finally:
        if (client is not None):
            client.close()

def MongoDBCSyncConnTest():
    try:
        client.admin.command("ping")
        print("Connected!")
        client.close()

    except Exception as e:
        raise Exception("Error: ", e)