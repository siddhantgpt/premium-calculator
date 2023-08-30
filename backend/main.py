# from src import app, config
from src import app, config
from src.auth.controller import register_auth_api_routes
from src.insurance.controller import register_insurance_api_routes
from src.config import rate_card_collection
from src.rate_card import fetch_and_save_data

register_auth_api_routes(app)
register_insurance_api_routes(app)

if __name__ == '__main__':
    if rate_card_collection.count_documents({}) == 0:
        print("Saving rate card data in collection")
        fetch_and_save_data()
    else:
        print("Data already exists in the collection.")
    app.run(host=config.APP_HOST, port=config.APP_PORT, debug=True)
