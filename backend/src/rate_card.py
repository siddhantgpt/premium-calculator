import csv

from src.config import rate_card_collection
from src import logger


def fetch_and_save_data():
    with open("../rate-card.csv", 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        for row in csv_reader:
            query = {
                "policy_type": row["member_csv"],
                "tier": row["tier"]
            }

            matching_document = rate_card_collection.find_one(query)

            if matching_document:
                age_range = row['age_range']
                new_premiums = {
                    "500000": float(row["500000"]),
                    "700000": float(row["700000"]),
                    "1000000": float(row["1000000"]),
                    "1500000": float(row["1500000"]),
                    "2000000": float(row["2000000"]),
                    "2500000": float(row["2500000"]),
                    "3000000": float(row["3000000"]),
                    "4000000": float(row["4000000"]),
                    "5000000": float(row["5000000"]),
                    "6000000": float(row["6000000"]),
                    "7500000": float(row["7500000"]),
                }

                update_operation = {
                    '$set': {
                        f'premium_data.{age_range}': new_premiums
                    }
                }
                rate_card_collection.update_one(query, update_operation)
            else:
                data = {
                    'policy_type': row["member_csv"],
                    'tier': row["tier"],
                    'premium_data': {
                        row["age_range"]: {
                            "500000": float(row["500000"]),
                            "700000": float(row["700000"]),
                            "1000000": float(row["1000000"]),
                            "1500000": float(row["1500000"]),
                            "2000000": float(row["2000000"]),
                            "2500000": float(row["2500000"]),
                            "3000000": float(row["3000000"]),
                            "4000000": float(row["4000000"]),
                            "5000000": float(row["5000000"]),
                            "6000000": float(row["6000000"]),
                            "7500000": float(row["7500000"]),
                        }
                    }
                }

                rate_card_collection.insert_one(data)
                print(f"Inserted: {data}")


def get_rates(policy_type, tier):
    query = {
        "policy_type": policy_type,
        "tier": tier
    }

    try:
        rate_card = rate_card_collection.find_one(query)

        if rate_card:
            return rate_card
        else:
            logger.error("Rate card not found for policy_type: {} and tier: {}".format(policy_type, tier))
    except Exception:
        logger.error("Error while getting rate card for policy_type: {}, tier: {}".format(policy_type, tier))

