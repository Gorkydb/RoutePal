from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.profile import Profile

profile_bp = Blueprint('profile_bp', __name__)

@profile_bp.route('/profile', methods=['POST'])
@jwt_required()
def create_or_update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        profile = Profile.query.filter_by(user_id=user_id).first()

        if not profile:
            profile = Profile(user_id=user_id)
            db.session.add(profile)

        profile.photos = data.get('photos')
        profile.travel_style = data.get('travelStyle')
        profile.travel_purpose = data.get('travelPurpose')
        profile.alcohol = data.get('alcohol')
        profile.smoking = data.get('smoking')
        profile.religion = data.get('religion')
        profile.zodiac = data.get('zodiac')
        profile.about = data.get('about')

        db.session.commit()

        return jsonify({'message': 'Profil başarıyla kaydedildi.'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Bir hata oluştu.', 'details': str(e)}), 500


@profile_bp.route('/profile/me', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        profile = Profile.query.filter_by(user_id=user_id).first()

        if not profile:
            return jsonify({'error': 'Profil bulunamadı.'}), 404

        return jsonify({
            'photos': profile.photos,
            'travelStyle': profile.travel_style,
            'travelPurpose': profile.travel_purpose,
            'alcohol': profile.alcohol,
            'smoking': profile.smoking,
            'religion': profile.religion,
            'zodiac': profile.zodiac,
            'about': profile.about
        }), 200

    except Exception as e:
        return jsonify({'error': 'Bir hata oluştu.', 'details': str(e)}), 500
