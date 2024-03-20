from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, metadata


account_users = db.Table(
    'account_users',
    metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('account_id', db.Integer, db.ForeignKey('accounts.id'), primary_key=True)
)


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, nullable=False)

    accounts = db.relationship('Account', secondary=account_users, back_populates='users', cascade='all, delete-orphan')

    serialize_rules('-accounts.users',)

    def __repr__(self):
        return f"<User {self.id}: {self.name}>"


class Account(db.Model, SerializerMixin):
    __tablename__ = 'accounts'

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Text)
    name = db.Column(db.Text)
    institution_name = db.Column(db.Text)

    users = db.relationship('User', secondary=account_users, back_populates='accounts', cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', back_populates='account', cascade='all, delete-orphan')

    serialize_rules=('-users.accounts',)


class PlaidItem(db.Model, SerializerMixin):
    __tablename__ = 'plaid_items'

    id = db.Column(db.Integer, primary_key=True)
    access_token = db.Column(db.Text)
    item_id = db.Column(db.Text)
    cursor = db.Column(db.Text) # received from transactions/get, used to set the starting point for the next transactions update

    account = db.relationship('Account')


class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    amount = db.Column(db.Integer)
    authorized_date = db.Column(db.Text)
    merchant_name = db.Column(db.Text)
    name = db.Column(db.Text)
    personal_finance_category = db.Column(db.Text)
    transaction_id = db.Column(db.Text) # used to identify transactions that have been modified or removed

    account = db.relationship('Account', back_populates='transactions')

    serialize_rules = ('-accounts.transactions',)

