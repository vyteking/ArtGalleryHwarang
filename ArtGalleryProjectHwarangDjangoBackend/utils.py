from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, OperationFailure

def get_collection(col_name, db_name='hwarangtestserver', host='mongodb://localhost:27017'):
    try:
        client = MongoClient(host, serverSelectionTimeoutMS=5000)  # 5초 타임아웃 설정
        db_handle = client[db_name]
        db_col = db_handle[col_name]
        return db_col
    except ServerSelectionTimeoutError as e:
        print(f"Could not connect to MongoDB: {e}")
        return None
    except OperationFailure as e:
        print(f"Authentication failed: {e}")
        return None

def get_db_handle(db_name, host, port, username, password):
    try:
        client = MongoClient(host=host, 
                            port=int(port), 
                            username=username,
                            password=password,
                            serverSelectionTimeoutMS=5000)  # 5초 타임아웃 설정
        db_handle = client[db_name]

        return db_handle, client
    except ServerSelectionTimeoutError as e:
        print(f"Could not connect to MongoDB: {e}")
        return None, None
    except OperationFailure as e:
        print(f"Authentication failed: {e}")
        return None, None

def GetMongoDBCollections(host, db_name):
    try:
        client = MongoClient(host, serverSelectionTimeoutMS=5000)  # 5초 타임아웃 설정
        db_handle = client[db_name]
        print(db_handle.list_collection_names())
    except ServerSelectionTimeoutError as e:
        print(f"Could not connect to MongoDB: {e}")
        return None
    except OperationFailure as e:
        print(f"Authentication failed: {e}")
        return None
    finally:
        if client is not None:
            client.close()

def MongoDBCSyncConnTest():
    try:
        client = MongoClient(host='localhost')  # 클라이언트 생성
        client.admin.command("ping")
        print("Connected!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if client is not None:
            client.close()

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