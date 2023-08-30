from pymongo import MongoClient

from src.config import client

# Set up MongoDB connection
db = client['insurance_db']
policy_collection = db['policy']
policy_collection.create_index([("user_id", 1)])