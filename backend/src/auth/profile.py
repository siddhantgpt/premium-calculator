import bcrypt
from bson import ObjectId
from flask import jsonify
from flask_jwt_extended import create_access_token
from pymongo.errors import PyMongoError

from src import logger
from src.auth import users_collection
from src.config import EXPIRE_DELTA


def get_profile_data(user_id):
    profile = users_collection.find_one({"_id": ObjectId(user_id)})
    if profile:
        data = {
            'user_id': str(profile['_id']),
            'name': profile['name'],
            'email': profile['email'],
            'phone': profile['phone']
        }
        return data
    else:
        logger.error("Profile not found for user_id: {}".format(user_id))
        return "Profile not found for user_id: {}".format(user_id)


def update_profile(user_id, name, email, phone):
    logger.info(f"Got request to update profile info for user_id: {user_id}")
    try:
        query = {"_id": ObjectId(user_id)}
        update_operation = {
            '$set': {
                'name': name,
                'email': email,
                'phone': phone
            }
        }

        result = users_collection.update_one(query, update_operation, upsert=False)

        if result.matched_count == 0:
            logger.error(f"User with ID {user_id} not found.")
            return False
        else:
            logger.info(f"Profile updated for user with ID {user_id}")
            return True

    except PyMongoError as e:
        logger.error(f"An error occurred while updating profile for {user_id}: {e}")
        return False


def change_password(user_id, current_password, new_password):
    logger.info(f"Got request to change password for user_id: {user_id}")

    query = {"_id": ObjectId(user_id)}
    profile = users_collection.find_one(query)

    if not profile:
        logger.error("Profile not found for user_id: {}".format(user_id))
        return False

    if not bcrypt.checkpw(current_password.encode('utf-8'), profile['password']):
        logger.error(f"Incorrect current password for user_id: {user_id}")
        return False

    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    update_operation = {
        '$set': {
            'password': hashed_password
        }
    }

    result = users_collection.update_one(query, update_operation, upsert=False)

    if result.matched_count == 0:
        logger.error(f"User with ID {user_id} not found.")
        return False

    logger.info(f"Password changed successfully for user with ID {user_id}")
    return True


def register_user(name, email, phone, password):
    logger.info(f"Got request to register user with name: {name}, email: {email}, phone: {phone}")

    validation_query = {'$or': [{'email': email}, {'phone': phone}]}
    existing_profile = users_collection.find_one(validation_query)

    if existing_profile:
        logger.error(f"Profile with email: {email} or phone: {phone} already registered")
        return jsonify({"error": "Email address or phone no. already registered!"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user_data = {
        'name': name,
        'email': email,
        'phone': phone,
        'password': hashed_password
    }
    try:
        users_collection.insert_one(user_data)
        logger.info(f"Profile saved successfully for user: {user_data}")
        return jsonify({"message": "Profile saved successfully!"}), 200
    except PyMongoError as e:
        logger.error(f"Error occurred while saving profile for user data: {user_data} to MongoDB: {e}")
        return jsonify({"error": "Registration failed!"}), 500


def login_user(email, password):
    logger.info(f"Got request to login user with email: {email}")

    user = users_collection.find_one({'email': email})

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = create_access_token(identity=user['name'], expires_delta=EXPIRE_DELTA)
        logged_in_user = {
            'user_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'phone': user['phone'],
            'token': token
        }
        return logged_in_user
    else:
        logger.error(f"Invalid credentials while login: {email}, {password}")
        return None
