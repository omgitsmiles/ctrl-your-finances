from app import app
from models import db, User, PlaidItem, Transaction

with app.app_context():
    print("Starting seed...")

    User.query.delete()

    frank = User(name='Frank Furter', email="frank@example.com", password="password1")

    db.session.add_all([frank])
    db.session.commit()

    PlaidItem.query.delete()
    db.session.commit()

    Transaction.query.delete()
    db.session.commit()
