import json
from datetime import datetime
from flask import Blueprint, request, jsonify
from models.profile import db, Profile

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['POST'])
def create_or_update_profile():
    try:
        data = request.get_json()
        user_id = data.get('user_id')  # Kimlik doğrulama sistemine göre değişebilir

        profile = Profile.query.filter_by(user_id=user_id).first()

        if not profile:
            profile = Profile(user_id=user_id)
            db.session.add(profile)

        profile.travel_style = data.get('travelStyle')
        profile.travel_purpose = data.get('travelPurpose')
        profile.bio = data.get('bio')
        profile.smoker = data.get('smoking') == 'Evet'
        profile.drink = data.get('drinking') == 'Evet'

        birth_date_str = data.get('birthDate')
        if birth_date_str:
            profile.birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()

        photos = data.get('photos', [])
        if isinstance(photos, list):
            profile.photos = json.dumps([photo.get('uri') for photo in photos])

        db.session.commit()
        return jsonify({'message': 'Profil başarıyla kaydedildi.'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Profil kaydedilirken bir hata oluştu.'}), 500
