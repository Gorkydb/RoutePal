from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user import User
from database import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Eksik bilgi!"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Bu e-posta adresi zaten kayıtlı."}), 409

    new_user = User(email=email)
    new_user.set_password(password)  # ✅ Şifreyi hashliyoruz!

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({"message": "Kayıt başarılı!", "token": access_token}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "E-posta veya şifre yanlış."}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Giriş başarılı!", "token": access_token}), 200
