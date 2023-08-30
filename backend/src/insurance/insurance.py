from datetime import datetime

from bson import ObjectId
from flask import jsonify

from src.insurance import policy_collection
from src.insurance.premium_calculator import calculate_premium
from src.rate_card import get_rates


def create_policy(user_id, policy_type, sum_assured, tier, tenure, member_data):
    rate_card = get_rates(policy_type, tier)
    total_premium = calculate_premium(member_data, rate_card, sum_assured)
    data = {
        "user_id": user_id,
        "policy_type": policy_type,
        "tier": tier,
        "sum_assured": sum_assured,
        "tenure": tenure,
        "member_data": member_data,
        "total_premium": total_premium,
        "is_deleted": False,
        "is_checked_out": False
    }

    policy_id = policy_collection.insert_one(data).inserted_id

    return policy_id


def get_policies(user_id):
    query = {
        "user_id": user_id,
        "is_deleted": False
    }
    policies = list(policy_collection.find(query))
    return policies


def get_policy(policy_id):
    policy = policy_collection.find_one({"_id": ObjectId(policy_id)})
    policy['_id'] = str(policy['_id'])
    return policy


def delete_policy(policy_id):
    if not ObjectId.is_valid(policy_id):
        return jsonify({"error": "Invalid Policy ID"}), 400

    query = {"_id": ObjectId(policy_id)}
    update_operation = {
        '$set': {
            'is_deleted': True
        }
    }
    result = policy_collection.update_one(query, update_operation, upsert=False)

    if result.matched_count == 0:
        return jsonify({"error": f"Policy {policy_id} not found"}), 404

    return "", 204


def checkout_policy(policy_id):
    if not ObjectId.is_valid(policy_id):
        return jsonify({"error": "Invalid Policy ID"}), 400

    query = {"_id": ObjectId(policy_id)}
    update_operation = {
        '$set': {
            'is_checked_out': True,
            'checkout_timestamp': datetime.today()
        }
    }
    result = policy_collection.update_one(query, update_operation, upsert=False)

    if result.matched_count == 0:
        return jsonify({"error": f"Policy {policy_id} not found"}), 404

    return "", 204
