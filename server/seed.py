from app import app
from models import db, User, Account, AccountUser, PlaidItem, Transaction, Household, Goal

with app.app_context():
    print("Starting seed...")

    User.query.delete()
    Account.query.delete()

    frank = User(name='Frank Furter', email="frank@example.com", password="password1")

    db.session.add_all([frank])
    db.session.commit()

    Goal.query.delete()
    
    goal = Goal(user= frank, name= 'castle', saved= 100, target= 1000)
    
    db.session.add_all([goal])
    db.session.commit()

    PlaidItem.query.delete()
    Transaction.query.delete()
    Household.query.delete()
    AccountUser.query.delete()

    household_1 = Household(name="Frank Furter's household")
    db.session.add_all([household_1])

    frank = User(name="Frank Furter", email="frank@example.com", household=household_1)
    sam = User(name="Sam Witch", email="sam@example.com", household=household_1)
    db.session.add_all([frank, sam])


    db.session.commit()
