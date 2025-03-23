from flask import Blueprint, jsonify

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route("/", methods=["GET"])
def recommend_places():
    return jsonify({"message": "This is where AI-based recommendations will be implemented."})

