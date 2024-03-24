#!/usr/bin/env python3

import os
import json
import time
import ipdb

# Remote library imports
from flask import request, jsonify, make_response
from flask_restful import Resource
from dotenv import load_dotenv

# Local imports
from config import app, db, api

# Model imports
from models import User, Account, AccountUser, PlaidItem, Transaction, Household


# TO DO: Remove user variable, get id from session
USER_ID = 1


# Views go here:

@app.route('/')
def index():
    return '<h1>Project Server</h1>'



################################################
##### ROUTES BASED ON PLAID QUICKSTART #########

import plaid
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.api import plaid_api

load_dotenv()

PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')
PLAID_COUNTRY_CODES = os.getenv('PLAID_COUNTRY_CODES', 'US').split(',')


def empty_to_none(field):
    value = os.getenv(field)
    if value is None or len(value) == 0:
        return None
    return value

host = plaid.Environment.Sandbox

if PLAID_ENV == 'sandbox':
    host = plaid.Environment.Sandbox

if PLAID_ENV == 'development':
    host = plaid.Environment.Development

if PLAID_ENV == 'production':
    host = plaid.Environment.Production

PLAID_REDIRECT_URI = empty_to_none('PLAID_REDIRECT_URI')

configuration = plaid.Configuration(
    host=host,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
        'plaidVersion': '2020-09-14'
    }
)

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

products = []
for product in PLAID_PRODUCTS:
    products.append(Products(product))

item_id = None


@app.route('/api/info', methods=['POST'])
def info():
    global access_token
    global item_id 
    response = jsonify({
        'item_id': item_id,
        'products': PLAID_PRODUCTS
    })
    return response


@app.route('/api/create_link_token', methods=['POST'])
def create_link_token():
    try:
        request = LinkTokenCreateRequest(
            products=products,
            client_name="Plaid Quickstart",
            country_codes=list(map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(time.time())
            )
        )
        if PLAID_REDIRECT_URI!=None:
            request['redirect_uri']=PLAID_REDIRECT_URI
    # create link token
        response = jsonify(client.link_token_create(request).to_dict())
        return response
    except plaid.ApiException as e:
        return json.loads(e.body)


# Exchange token flow - exchange a Link public_token for
# an API access_token
# https://plaid.com/docs/#exchange-token-flow


@app.route('/api/set_access_token', methods=['POST'])
def get_access_token():
    user = User.query.filter_by(id=USER_ID).first()
    access_token = ''

    global item_id
    public_token = request.json['public_token']
    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']

        # save token and id to database.  MUST ENCRYPT THIS.
        new_plaid_item = PlaidItem(access_token=access_token, item_id=item_id, cursor='', user_id=USER_ID)
        db.session.add(new_plaid_item)
        db.session.commit()

        accounts_request = AccountsGetRequest(access_token=access_token)
        accounts_response = client.accounts_get(accounts_request)
        accounts = accounts_response['accounts']
        new_accounts = []
        for account in accounts:
            new_account = Account(
                account_id = account['account_id'],
                name = account['name'],
                plaid_item_id = new_plaid_item.id
            )
            new_accounts.append(new_account)
        db.session.add_all(new_accounts)
        db.session.commit()

        new_account_users = []
        for account in new_accounts:
            new_account_user = AccountUser(user_id=USER_ID, account_id=account.id)
            new_account_users.append(new_account_user)
        db.session.add_all(new_account_users)
        db.session.commit()

        return make_response({'message': 'account linked successfully'}, 200)
    except plaid.ApiException as e:
        return json.loads(e.body)


# Retrieve Transactions for an Item
# https://plaid.com/docs/#transactions

@app.route('/api/transactions', methods=['GET'])
def get_transactions():

    plaid_items = PlaidItem.query.filter_by(user_id = USER_ID).all()

    all_transactions = []

    for item in plaid_items:
        cursor = item.cursor
        access_token = item.access_token

        # New transaction updates since "cursor"
        added = []
        modified = []
        removed = [] # Removed transaction ids
        has_more = True
        try:
            # Iterate through each page of new transaction updates for item
            while has_more:
                request = TransactionsSyncRequest(
                    access_token=access_token,
                    cursor=cursor,
                )
                response = client.transactions_sync(request).to_dict()
                # Add this page of results
                added.extend(response['added'])
                modified.extend(response['modified'])
                removed.extend(response['removed'])
                has_more = response['has_more']
                # Update cursor to the next cursor
                cursor = response['next_cursor']
                # pretty_print_response(response)

                # update plaid_items row cursor based on access token
                plaid_item = PlaidItem.query.filter_by(access_token=access_token).first()
                plaid_item.cursor = cursor
            
            new_transactions = []
            for transaction in added:
                account = Account.query.filter_by(account_id=transaction['account_id']).first()
                new_transaction = Transaction(
                    account_id = account.id,
                    plaid_account_id = transaction['account_id'],
                    amount = transaction['amount'],
                    authorized_date = transaction['authorized_date'],
                    name = transaction['name'],
                    personal_finance_category_primary = transaction['personal_finance_category']['primary'],
                    personal_finance_category_detail = transaction['personal_finance_category']['detailed'],
                    transaction_id = transaction['transaction_id']
                )
                new_transactions.append(new_transaction)
            all_transactions.extend(new_transactions)
            
            db.session.add_all(new_transactions)
            db.session.commit()

        except plaid.ApiException as e:
            error_response = format_error(e)
            return jsonify(error_response)
    
    response = [transaction.to_dict() for transaction in all_transactions]
    return make_response(response, 200)


def pretty_print_response(response):
    print(json.dumps(response, indent=2, sort_keys=True, default=str))

def format_error(e):
    response = json.loads(e.body)
    return {'error': {'status_code': e.status, 'display_message':
                      response['error_message'], 'error_code': response['error_code'], 'error_type': response['error_type']}}




################################################
### RETRIEVING ACCOUNTS AND HOUSEHOLD INFO #####

class UserByUID(Resource):

    def post(self, uid):
        user = User.query.filter_by(uid=uid).first()
        ipdb.set_trace()
        if user:
            response = {
                id: user.id,
                name: user.name,
                email: user.email,
                household_id: user.household_id
            }
            return make_response(response, 200)
        else:
            data = request.json
            try:
                new_user = User(name=data['name'], email=data['email'], uid=data['uid'], household=f"{data['name']}'s Household'")
                db.session.add(new_user)
                db.session.commit()
                response = {
                    id: new_user.id,
                    name: new_user.name,
                    email: new_user.email,
                    household_id: new_user.household_id
                }
                return make_response(response, 200)
            except Exception as e:
                return make_response({'error': str(e)}, 500)

api.add_resource(UserByUID, '/api/users/<uid>')


class AccountsByUser(Resource):

    def get(self, user_id):
        try:
            user_accounts = db.session.query(Account).join(AccountUser, Account.id == AccountUser.account_id).filter(AccountUser.user_id == USER_ID).all()
            if user_accounts:
                accounts = []
                for account in user_accounts:
                    response_object = {
                        'id': account.id,
                        'name': account.name,
                        'plaid_item_id': account.plaid_item_id
                    }
                    accounts.append(response_object)
                return make_response(accounts, 200)
            else:
                return make_response({'error': 'Unable to retrieve user accounts'}, 404)
        except Exception as e:
            return make_response({'error': str(e)}, 500)

api.add_resource(AccountsByUser, '/api/accounts/<int:user_id>')


class HouseholdMembers(Resource):

    def get(self, user_id):
        try:
            user = User.query.filter_by(id=user_id).first()
            household = Household.query.filter_by(id=user.household_id).first()
            house_members = User.query.filter_by(household_id=household.id).all()
            if house_members:
                house_members_list = [member.to_dict() for member in house_members]
                response = {
                    'household': household.name,
                    'members': house_members_list
                }
                return make_response(response, 200)
            else:
                return make_response({'error': 'Unable to retrieve household member information'})
        except Exception as e:
            return make_response({'error': str(e)}, 500)

api.add_resource(HouseholdMembers, '/api/household/<int:user_id>')


class TransactionsByUser(Resource):

    def get(self, id):
        try:
            transactions = db.session.query(Transaction).join(
                Account, Transaction.account_id == Account.id
                ).join(
                    AccountUser, Account.id == AccountUser.account_id
                ).filter(AccountUser.user_id == id).all()
            
            if transactions:
                transaction_list = []
                for t in transactions:
                    transaction_object = {
                        'id': t.id,
                        'account_id': t.account_id,
                        'amount': t.amount,
                        'name': t.name,
                        'primary_category': t.personal_finance_category_primary,
                        'detail_category': t.personal_finance_category_detail,
                    }
                    transaction_list.append(transaction_object)

                response = sort_by_primary_category(transaction_list)
                return make_response(response, 200)
            else:
                return make_response({'error': 'No transactions found'}, 404)
        except Exception as e:
            return make_response({'error': str(e)}, 500)

api.add_resource(TransactionsByUser, '/api/transactions/<int:id>')


def sort_by_primary_category(transactions):

    grouped_by_primary = {}

    for transaction in transactions:
        category = transaction['primary_category']
        if category in grouped_by_primary:
            grouped_by_primary[category]['transactions'].append(transaction)
            grouped_by_primary[category]['amount'] += transaction['amount']
        else:
            grouped_by_primary[category] = {
                'category': category,
                'amount': transaction['amount'],
                'transactions': [transaction]                
            }

    for category in grouped_by_primary:
        grouped_by_primary[category]['amount'] = "%0.2f" % (grouped_by_primary[category]['amount'],)

    return [v for k, v in grouped_by_primary.items()]



################################################
# MANAGING ACCOUNTS AND HOUSEHOLD PERMISSIONS ##

class PlaidItemById(Resource):

    def delete(self, id):
        plaid_item = PlaidItem.query.filter_by(id=id).first()
        if plaid_item:
            try:
                db.session.delete(plaid_item)
                db.session.commit()
                return make_response({'message': f'Plaid link item {id} deleted'}, 200)
            except Exception as e:
                return make_response({'error': str(e)}, 500)
        else:
            return make_response({'error': f'Plaid link item {id} not found'}, 404)

api.add_resource(PlaidItemById, '/api/plaiditem/<int:id>')


class HouseholdAccounts(Resource):

    def post(self, id):
        pass

    def delete(self, id):
        pass

api.add_resource(HouseholdAccounts, '/api/household/accounts/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)