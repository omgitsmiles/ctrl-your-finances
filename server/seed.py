from app import app
from models import db, User

with app.app_context():
    print("Starting seed...")

    User.query.delete()

    frank = User(name='Frank Furter', email="frank@example.com", password="password1")

    db.session.add_all([frank])
    db.session.commit()

