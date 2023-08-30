# config.py
from pymongo import MongoClient
from datetime import timedelta

## Server
APP_HOST = "0.0.0.0"
APP_PORT = 8080

## MongoDB
connection_string = ("mongodb+srv://all-assure-insurance:4i4xj9IV3pP6gkER@cluster0.s03xxje.mongodb.net/?retryWrites"
                     "=true&w=majority")
client = MongoClient(connection_string)
insurance_db = client["insurance"]
rate_card_collection = insurance_db["rate_card"]

## Logging
LOGGER_NAME = "ALL_ASSURE"
# LOGGER_PATH = "../logs/"
LOGGER_FILE = "all_assure.log"

## Token
EXPIRE_DELTA = timedelta(minutes=30)
