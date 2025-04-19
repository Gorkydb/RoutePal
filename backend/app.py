import os
from flask import Flask, request, jsonify
from config import Config
from database import db
from models import bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_jwt_extended import JWTManager

# Flask uzantılarının başlatılması
migrate = Migrate()
login_manager = LoginManager()
jwt = JWTManager()

def create_app():
    """ Flask uygulamasını başlatan fonksiyon """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Veritabanı bağlantısını başlat
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    jwt.init_app(app)

    # CORS yapılandırması
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    # Blueprint'lerin yüklenmesi
    with app.app_context():
        from models import user, profile, place
        db.create_all()

        from routes.auth import auth_bp
        from routes.recommendations import recommendations_bp
        from routes.maps import maps_bp
        from routes.profile import profile_bp

        # URL prefix'leri düzgün tanımlandı
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(recommendations_bp, url_prefix='/recommendations')
        app.register_blueprint(maps_bp, url_prefix='/maps')
        app.register_blueprint(profile_bp, url_prefix='/profile')

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
