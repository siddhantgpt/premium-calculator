from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import logging
import os

import src.config

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "267399083261869014533073968905444147610"

jwt = JWTManager(app)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# # Directory creation
# if not os.path.exists(config.LOGGER_PATH):
#     os.makedirs(config.LOGGER_PATH)

# Logging
logger = logging.getLogger(config.LOGGER_NAME)
logger.setLevel(logging.INFO)

formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(formatter)

# file_handler = logging.FileHandler(config.LOGGER_PATH + config.LOGGER_FILE)  # Specify the file path here
# file_handler.setLevel(logging.INFO)
# file_handler.setFormatter(formatter)


logger.addHandler(console_handler)
# logger.addHandler(file_handler)