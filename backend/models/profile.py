from database import db
import pickle
from sqlalchemy.types import TypeDecorator, LargeBinary
from sqlalchemy.dialects.mysql import LONGTEXT

# 🎯 PickleType tanımı – liste gibi verileri saklamak için
class PickleType(TypeDecorator):
    impl = LargeBinary

    def process_bind_param(self, value, dialect):
        return pickle.dumps(value)

    def process_result_value(self, value, dialect):
        return pickle.loads(value)

# ✅ Güncellenmiş Profile modeli
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    
    hobbies = db.Column(PickleType, nullable=True)  # liste verisi için
    traits = db.Column(db.String(255), nullable=True)
    usage_purpose = db.Column(db.String(255), nullable=True)
    profile_picture = db.Column(LONGTEXT, nullable=True)  # base64 veri uzun olabilir

    def __repr__(self):
        return f"<Profile user_id={self.user_id}>"
