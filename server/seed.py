from app import app
from models import db, account_users, User, Account, PlaidItem, Transaction, Household

with app.app_context():
    print("Starting seed...")

    User.query.delete()
    Account.query.delete()
    PlaidItem.query.delete()
    Transaction.query.delete()
    Household.query.delete()

    household_1 = Household(name="Frank Furter's household")
    db.session.add_all([household_1])

    frank = User(name="Frank Furter", email="frank@example.com", household=household_1)
    db.session.add_all([frank])

    db.session.commit()
