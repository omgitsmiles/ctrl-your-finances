from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)

    transactions = db.relationship('Transaction', back_populates='user', cascade='all, delete-orphan')
    plaid_items = association_proxy('transactions', 'plaid_item')

    serialize_rules = ('-transactions.user',)

    def __repr__(self):
        return f"<User {self.id}: {self.name}>"


class PlaidItem(db.Model, SerializerMixin):
    __tablename__ = 'plaid_items'

    id = db.Column(db.Integer, primary_key=True)
    access_token = db.Column(db.Text)
    item_id = db.Column(db.Text)
    cursor = db.Column(db.Text) # received from transactions/get, used to set the starting point for the next transactions update

    transactions = db.relationship('Transaction', back_populates='plaid_item', cascade='all, delete-orphan')
    user = association_proxy('transactions', 'user')

    serialize_rules = ('-transactions.plaid_item',)


class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    plaid_item_id = db.Column(db.Integer, db.ForeignKey('plaid_items.id'))
    amount = db.Column(db.Integer)
    authorized_date = db.Column(db.Text)
    merchant_name = db.Column(db.Text)
    name = db.Column(db.Text)
    personal_finance_category = db.Column(db.Text)
    transaction_id = db.Column(db.Text) # used to identify transactions that have been modified or removed

    user = db.relationship('User', back_populates='transactions')
    plaid_item = db.relationship('PlaidItem', back_populates='transactions')

    serialize_rules = ('-users.transactions', '-plaid_items.transactions')

