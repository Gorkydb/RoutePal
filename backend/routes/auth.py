from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.user import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email ve şifre gerekli.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Bu email ile kayıtlı bir kullanıcı zaten var.'}), 409

    hashed_password = generate_password_hash(password)
    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Kayıt başarılı'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email ve şifre gerekli.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Email veya şifre hatalı'}), 401

    token = create_access_token(identity=user.id)
    return jsonify({'token': token}), 200
