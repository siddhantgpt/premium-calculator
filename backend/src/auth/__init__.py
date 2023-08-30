from pymongo import MongoClient

from src.config import client

# Set up MongoDB connection
db = client['user_db']
users_collection = db['users']
