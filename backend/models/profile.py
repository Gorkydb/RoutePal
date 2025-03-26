from database import db
import json

class Profile(db.Model):
    __tablename__ = "profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), unique=True)
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    bio = db.Column(db.Text)
    travel_style = db.Column(db.String(255))
    travel_purpose = db.Column(db.String(255))
    hobbies = db.Column(db.Text)
    personality = db.Column(db.Text)
    relationship_status = db.Column(db.String(50))
    smoker = db.Column(db.Boolean)
    drink = db.Column(db.Boolean)
    languages = db.Column(db.Text)
    last_5_locations = db.Column(db.Text)
    dream_destinations = db.Column(db.Text)
    photo = db.Column(db.Text)
    current_lat = db.Column(db.Float)
    current_lng = db.Column(db.Float)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "bio": self.bio,
            "travel_style": self.travel_style,
            "travel_purpose": self.travel_purpose,
            "hobbies": json.loads(self.hobbies or "[]"),
            "personality": json.loads(self.personality or "[]"),
            "relationship_status": self.relationship_status,
            "smoker": self.smoker,
            "drink": self.drink,
            "languages": json.loads(self.languages or "[]"),
            "last_5_locations": json.loads(self.last_5_locations or "[]"),
            "dream_destinations": json.loads(self.dream_destinations or "[]"),
            "photo": self.photo,
            "current_lat": self.current_lat,
            "current_lng": self.current_lng,
        }
