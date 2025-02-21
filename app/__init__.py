from flask import Flask
from flask_cors import CORS

from .config import FLASK_DEBUG
from .routes import api

def create_app():
    """Create Flask app instance."""
    app = Flask(__name__)
    app.register_blueprint(api, url_prefix="/api")
    CORS(app)

    return app


