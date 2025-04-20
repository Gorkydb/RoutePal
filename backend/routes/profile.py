from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.profile import Profile

profile_bp = Blueprint('profile_bp', __name__)

@profile_bp.route('', methods=['POST'])
@jwt_required()
def create_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    profile = Profile(
        user_id=user_id,
        travel_style=data.get('travelStyle'),
        travel_purpose=data.get('travelPurpose'),
        smoking=data.get('smoking'),
        alcohol=data.get('alcohol'),
        birth_date=data.get('birthDate'),
        zodiac=data.get('zodiac'),
        bio=data.get('bio'),
        photo=data.get('photo')
    )
    db.session.add(profile)
    db.session.commit()

    return jsonify({'message': 'Profile created successfully'}), 201
