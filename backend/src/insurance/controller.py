import json

from flask import Flask, request, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from pymongo import MongoClient
from bson import json_util
import bcrypt

from src import app, logger
import src.insurance.insurance as insurance


def register_insurance_api_routes(app):
    @app.route('/api/save-policy', methods=['POST'])
    @jwt_required()
    @cross_origin()
    def create_policy():
        data = request.json
        try:
            user_id = data.get('user_id')
            policy_type = data.get('policy_type')
            tier = data.get('tier')
            sum_assured = data.get('sum_assured')
            tenure = data.get('tenure')
            member_data = data.get("member_data")

            policy_id = insurance.create_policy(user_id, policy_type, sum_assured, tier, tenure, member_data)

            return jsonify({"message": "Policy saved successfully!", "policy_id": str(policy_id)}), 200
        except Exception as e:
            logger.error("Exception while saving policy for data: {} error: {}".format(data, e))
            return jsonify({"message": "Exception while saving policy"}), 400

    @app.route("/api/get-policy-data", methods=["GET"])
    @jwt_required()
    @cross_origin()
    def get_policy_data():
        try:
            user_id = request.args.get("user_id")

            if user_id:
                policies = json.loads(json_util.dumps(insurance.get_policies(user_id)))
                return jsonify(policies)
            else:
                return jsonify({"message": "User ID parameter is missing."}), 400
        except Exception as e:
            logger.error(f"Exception occurred while getting policies for user {e}")
            return jsonify({"error": "Error occurred while getting policies for user"}), 400

    @app.route("/api/get-policy", methods=["GET"])
    @jwt_required()
    @cross_origin()
    def get_policy():
        policy_id = request.args.get("policy_id")

        if policy_id:
            policy = insurance.get_policy(policy_id)
            return jsonify(policy)
        else:
            return jsonify({"message": "Policy ID parameter is missing."}), 400

    @app.route("/api/delete-policy", methods=["DELETE"])
    @jwt_required()
    @cross_origin()
    def delete_policy():
        try:
            policy_id = request.args.get("policy_id")

            if policy_id:
                return insurance.delete_policy(policy_id)

        except Exception as e:
            logger.error(f"Exception occurred while deleting policy {e}")
            return jsonify({"error": "Error occurred while deleting policy"}), 400

    @app.route("/api/checkout-policy", methods=["POST"])
    @jwt_required()
    @cross_origin()
    def checkout_policy():
        try:
            policy_id = request.args.get("policy_id")

            if policy_id:
                return insurance.checkout_policy(policy_id)

        except Exception as e:
            logger.error(f"Exception occurred while deleting policy {e}")
            return jsonify({"error": "Error occurred while deleting policy"}), 400
