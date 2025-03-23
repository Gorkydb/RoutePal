from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.profile import Profile
from database import db

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        print("🚨 Kullanıcı bulunamadı.")
        return jsonify({"error": "Kullanıcı bulunamadı!"}), 404

    profile = Profile.query.filter_by(user_id=user.id).first()

    if not profile:
        print("⚠️ Kullanıcının profili yok, boş profil döndürülüyor.")
        return jsonify({
            "id": user.id,
            "email": user.email,
            "profile": {
                "hobbies": [],
                "traits": "",
                "usage_purpose": "",
                "profile_picture": None
            }
        }), 200

    return jsonify({
        "id": user.id,
        "email": user.email,
        "profile": {
            "hobbies": profile.hobbies if profile.hobbies else [],
            "traits": profile.traits if profile.traits else "",
            "usage_purpose": profile.usage_purpose if profile.usage_purpose else "",
            "profile_picture": profile.profile_picture if profile.profile_picture else None
        }
    }), 200


@profile_bp.route("/update", methods=["POST"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Kullanıcı bulunamadı!"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"error": "Eksik veri!"}), 422

    hobbies = data.get("hobbies")
    traits = data.get("traits")
    usage_purpose = data.get("usage_purpose")
    profile_picture = data.get("profile_picture")

    if not (hobbies and traits and usage_purpose):
        return jsonify({"error": "Tüm alanlar zorunludur!"}), 422

    # Kullanıcının profili varsa güncelle, yoksa oluştur
    profile = Profile.query.filter_by(user_id=user.id).first()

    if profile:
        profile.hobbies = hobbies
        profile.traits = traits
        profile.usage_purpose = usage_purpose
        profile.profile_picture = profile_picture
    else:
        profile = Profile(
            user_id=user.id,
            hobbies=hobbies,
            traits=traits,
            usage_purpose=usage_purpose,
            profile_picture=profile_picture
        )
        db.session.add(profile)

    db.session.commit()
    return jsonify({"message": "Profil başarıyla güncellendi."}), 200
