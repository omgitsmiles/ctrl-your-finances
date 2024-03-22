from app import app
from models import db, User, PlaidItem, Transaction, Goal

with app.app_context():
    print("Starting seed...")

    User.query.delete()

    frank = User(name='Frank Furter', email="frank@example.com", password="password1")

    db.session.add_all([frank])
    db.session.commit()

    Goal.query.delete()
    
    goal = Goal(user= frank, name= 'castle', saved= 100, target= 1000)
    
    db.session.add_all([goal])
    db.session.commit()

    PlaidItem.query.delete()
    db.session.commit()

    Transaction.query.delete()
    db.session.commit()
