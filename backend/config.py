import os
from dotenv import load_dotenv
from datetime import timedelta

# Çevresel değişkenleri yükle
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    
    # Veritabanı Bağlantısı
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql+pymysql://root:sifre123@localhost/routepal_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # API Anahtarları
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

    # JWT Ayarları
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretjwtkey")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)  # Token süresi 7 gün

