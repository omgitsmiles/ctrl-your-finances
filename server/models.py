from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, metadata


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, nullable=False)
    household_id = db.Column(db.Integer, db.ForeignKey('households.id'))

    account_user = db.relationship('AccountUser', back_populates='users')
    household = db.relationship('Household', back_populates='users')
    plaid_items = db.relationship('PlaidItem', back_populates='user')
    accounts = association_proxy('account_users', 'accounts')

    serialize_rules = ('-account_user.users', '-accounts.users', '-plaid_items.user', '-household')

    def __repr__(self):
        return f"<User {self.id}: {self.name}>"


class Account(db.Model, SerializerMixin):
    __tablename__ = 'accounts'

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Text)
    name = db.Column(db.Text)
    institution_name = db.Column(db.Text)
    household_id = db.Column(db.Integer, db.ForeignKey('households.id'))
    plaid_item_id = db.Column(db.Integer, db.ForeignKey('plaid_items.id'))

    transactions = db.relationship('Transaction', back_populates='account', cascade='all, delete-orphan')
    household = db.relationship('Household', back_populates='accounts')
    plaid_item = db.relationship('PlaidItem', back_populates='accounts')
    account_user = db.relationship('AccountUser', back_populates='accounts')
    users = association_proxy('account_users', 'users')

    serialize_rules = ('-transactions.account', '-households.accounts', '-plaid_item.accounts', '-account_user.accounts')


class AccountUser(db.Model, SerializerMixin):
    __tablename__ = 'account_users'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))

    users = db.relationship('User', back_populates='account_user')
    accounts = db.relationship('Account', back_populates='account_user')

    serialize_rules = ('-users.account_user', '-accounts.account_user')


class PlaidItem(db.Model, SerializerMixin):
    __tablename__ = 'plaid_items'

    id = db.Column(db.Integer, primary_key=True)
    access_token = db.Column(db.Text)
    item_id = db.Column(db.Text)
    cursor = db.Column(db.Text) # received from transactions/get, used to set the starting point for the next transactions update
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    accounts = db.relationship('Account', back_populates='plaid_item')
    user = db.relationship('User', back_populates='plaid_items')

    serialize_rules = ('-accounts.plaid_item', '-user.plaid_items')


class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    amount = db.Column(db.Integer)
    authorized_date = db.Column(db.Text)
    merchant_name = db.Column(db.Text)
    name = db.Column(db.Text)
    personal_finance_category = db.Column(db.Text)
    transaction_id = db.Column(db.Text) # used to identify transactions that have been modified or removed

    account = db.relationship('Account', back_populates='transactions')

    serialize_rules = ('-accounts.transactions',)


class Household(db.Model, SerializerMixin):
    __tablename__ = 'households'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)

    users = db.relationship('User', back_populates='household')
    accounts = db.relationship('Account', back_populates='household')

    serialize_rules = ('-users.household', '-accounts.household')

