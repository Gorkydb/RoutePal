from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Profile(db.Model):
    __tablename__ = 'profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False, unique=True)
    travel_style = db.Column(db.String(100))
    travel_purpose = db.Column(db.String(100))
    bio = db.Column(db.Text)
    smoker = db.Column(db.Boolean)  # frontend: "smoking"
    drink = db.Column(db.Boolean)   # frontend: "drinking"
    birth_date = db.Column(db.Date) # frontend: "birthDate"
    photos = db.Column(db.Text)     # JSON string (list of URIs)

    def __init__(self, user_id, travel_style=None, travel_purpose=None, bio=None,
                 smoker=None, drink=None, birth_date=None, photos=None):
        self.user_id = user_id
        self.travel_style = travel_style
        self.travel_purpose = travel_purpose
        self.bio = bio
        self.smoker = smoker
        self.drink = drink
        self.birth_date = birth_date
        self.photos = photos
