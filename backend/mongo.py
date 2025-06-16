from pymongo import MongoClient
from bson import ObjectId

class MongoDB:
    def __init__(self, db_url: str, db_name: str):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]

    def get_collection(self, collection_name: str):
        return self.db[collection_name]

    def insert_one(self, collection_name: str, document: dict):
        collection = self.get_collection(collection_name)
        return collection.insert_one(document).inserted_id

    def find_one(self, collection_name: str, query: dict):
        collection = self.get_collection(collection_name)
        return collection.find_one(query)

    def find_by_id(self, collection_name: str, document_id: str):
        collection = self.get_collection(collection_name)
        return collection.find_one({'_id': ObjectId(document_id)})

    def find(self, collection_name: str, query: dict = {}):
        collection = self.get_collection(collection_name)
        return list(collection.find(query))

    def update_one(self, collection_name: str, query: dict, update: dict):
        collection = self.get_collection(collection_name)
        return collection.update_one(query, {'$set': update})

    def delete_one(self, collection_name: str, query: dict):
        collection = self.get_collection(collection_name)
        return collection.delete_one(query)

    def delete_by_id(self, collection_name: str, document_id: str):
        collection = self.get_collection(collection_name)
        return collection.delete_one({'_id': ObjectId(document_id)})
