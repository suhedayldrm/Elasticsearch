from flask import Blueprint, request, jsonify
from .services import search
import logging

api = Blueprint("api", __name__)

@api.route("/search", methods=["GET"])
def search_media():
    """Search media content."""
    query = request.args.get("q", "")
    
    logging.info(f"Received search request: {query}")  # Debug log

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    results = search(query)

    logging.info(f"Search results: {results}")  # Debug log

    return jsonify(results)





