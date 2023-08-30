import json

from flask import Flask, request, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from pymongo import MongoClient

from src import logger
from src.auth.profile import get_profile_data, update_profile, change_password, register_user, login_user

# Set up MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['user_db']
users_collection = db['users']


def register_auth_api_routes(app):
    @app.route('/api/register', methods=['POST'])
    @cross_origin()
    def register():
        try:
            data = request.json

            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')
            password = data.get('password')

            return register_user(name, email, phone, password)

        except KeyError as ke:
            logger.error(f"Invalid input data for profile registration: {request.json}, error: {ke}")
            return jsonify({"error": "Invalid entry!"}), 400
        except Exception as e:
            logger.error(f"Exception occurred while getting response for data: {request.json}, error: {e}")
            return jsonify({"error": "Registration failed!"}), 500

    @app.route('/api/login', methods=['POST'])
    @cross_origin()
    def login():
        try:
            data = request.json

            email = data.get('email')
            password = data.get('password')

            user = login_user(email, password)
            if user:
                return jsonify({'user': user}), 200
            else:
                return jsonify({'error': 'Invalid credentials'}), 401

        except KeyError as ke:
            logger.error(f"Invalid input data for profile login: {request.json}, error: {ke}")
            return jsonify({"error": "Invalid entry!"}), 400
        except Exception as e:
            logger.error(f"Exception occurred while getting response for data: {request.json}, error: {e}")
            return jsonify({"error": "Login failed!"}), 500

    @app.route('/api/get-profile', methods=['GET'])
    @jwt_required()
    @cross_origin()
    def get_profile():
        user_id = request.args.get("user_id")

        if user_id:
            profile = get_profile_data(user_id)
            return jsonify(profile), 200
        else:
            return jsonify({"message": "User ID parameter is missing."}), 400

    @app.route('/api/save-profile', methods=['POST'])
    @jwt_required()
    @cross_origin()
    def save_profile():
        try:
            data = request.json

            user_id = data.get("user_id")
            name = data.get("name")
            email = data.get("email")
            phone = data.get("phone")

            success = update_profile(user_id, name, email, phone)

            if success:
                return jsonify({"message": "Profile update successful"}), 200
            else:
                return jsonify({"error": "User profile not found or database error"}), 404

        except KeyError:
            logger.error(f"Invalid input data for profile update: {request.json}")
            return jsonify({"error": "Invalid input data."}), 400
        except Exception as e:
            logger.error(f"Exception occurred while getting response for data: {request.json}, error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

    @app.route('/api/update-password', methods=['POST'])
    @jwt_required()
    @cross_origin()
    def update_password():
        try:
            data = request.json

            user_id = data.get("user_id")
            current_password = data.get("current_password")
            new_password = data.get("new_password")

            success = change_password(user_id, current_password, new_password)

            if success:
                return jsonify({"message": "Password updated successfully"}), 200
            else:
                return jsonify({"error": "Failed to update password"}), 400

        except KeyError:
            logger.error(f"Invalid input data: {request.json}")
            return jsonify({"error": "Invalid input data."}), 400
        except Exception as e:
            logger.error(f"Exception occurred while updating password for data: {request.json}, error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

    @app.route('/api/registers', methods=['POST'])
    @cross_origin()
    def register():
        return jsonify({"error": "Registration failed!"}), 200
