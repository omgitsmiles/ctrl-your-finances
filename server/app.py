#!/usr/bin/env python3

import os
import json
import time
import ipdb
import pathlib
import textwrap
import google.generativeai as genai

# Remote library imports
from flask import request, jsonify, make_response
from flask_restful import Resource
from dotenv import load_dotenv
from IPython.display import display
from IPython.display import Markdown

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel('gemini-pro')

# Local imports
from config import app, db, api, cipher_suite

# Model imports
from models import User, Account, AccountUser, PlaidItem, Transaction, Household, Goal


# Views go here:

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


################################################
##### GOOGLE GEMINI MARKDOWN & QUICKSTART ######

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

# content = model.generate_content("name the best coding bootcamp in the world")

# print(content.text)


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


class CreateLinkToken(Resource):

    def options(self):
        response_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '600',
        }
        return ('', 204, response_headers)

    def post(self):
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

api.add_resource(CreateLinkToken, '/api/create_link_token')

# Exchange token flow - exchange a Link public_token for
# an API access_token
# https://plaid.com/docs/#exchange-token-flow

class SetAccessToken(Resource):

    def options(self):
        response_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '600',
        }
        return ('', 204, response_headers)

    # @app.route('/api/set_access_token/<int:user_id>', methods=['POST'])
    def post(self):
        access_token = ''
        global item_id
        public_token = request.form.get('public_token')
        USER_ID = request.form.get('id')

        try:
            exchange_request = ItemPublicTokenExchangeRequest(
                public_token=public_token)
            exchange_response = client.item_public_token_exchange(exchange_request)
            access_token = exchange_response['access_token']
            item_id = exchange_response['item_id']

            # save token and id to database.  MUST ENCRYPT THIS.
            _access_token = cipher_suite.encrypt(bytes(access_token, 'utf-8'))
            new_plaid_item = PlaidItem(access_token=_access_token, item_id=item_id, cursor='', user_id=USER_ID)
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

api.add_resource(SetAccessToken, '/api/set_access_token')


# Retrieve Transactions for an Item
# https://plaid.com/docs/#transactions

class Transactions(Resource):

    def options(self, user_id):
        response_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '600',
        }
        return ('', 204, response_headers)

    def get(self, user_id):

        # public_token = request.form.get('public_token')

        # user_id = request.form.get('id')

        plaid_items = PlaidItem.query.filter_by(user_id = user_id).all()

        all_transactions = []

        for item in plaid_items:
            cursor = item.cursor
            access_token = cipher_suite.decrypt(item.access_token).decode("utf-8")

            # New transaction updates since "cursor"
            added = []
            modified = []
            removed = [] # Removed transaction ids
            has_more = True
            try:
                # Iterate through each page of new transaction updates for item
                while has_more:
                    sync_request = TransactionsSyncRequest(
                        access_token=access_token,
                        cursor=cursor,
                    )
                    response = client.transactions_sync(sync_request).to_dict()
                    # Add this page of results
                    added.extend(response['added'])
                    modified.extend(response['modified'])
                    removed.extend(response['removed'])
                    has_more = response['has_more']
                    # Update cursor to the next cursor
                    cursor = response['next_cursor']
                    # pretty_print_response(response)

                    # update plaid_item cursor based on access token
                    item.cursor = cursor
                
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

api.add_resource(Transactions, '/api/transactions/<int:user_id>')




# Get & Add Budget Goals


#fetch user goals
class Goals(Resource):

    def options(self, user_id):
        response_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '600',
        }
        return ('', 204, response_headers)

    def get(self, user_id):
        # Get goals
        goals = Goal.query.filter_by(user_id = user_id).all()
        response = [goal.to_dict() for goal in goals] 
        return make_response(response, 200)

    def post(self, user_id):
    # add a new goal
        # data = request.json
        name = request.form.get('name')
        saved = request.form.get('saved')
        target = request.form.get('target')

        # new_goal = Goal(
        #     user_id=user_id,
        #     name=data['name'],
        #     saved=data['saved'],
        #     target=data['target']
        # )
        new_goal = Goal(
            user_id=user_id,
            name=name,
            saved=saved,
            target=target
        )

        db.session.add(new_goal)
        db.session.commit()
        response = new_goal.to_dict()
        return make_response(response, 200)

api.add_resource(Goals, '/api/goals/<int:user_id>')



def format_error(e):
    response = json.loads(e.body)
    return {'error': {'status_code': e.status, 'display_message':
                    response['error_message'], 'error_code': response['error_code'], 'error_type': response['error_type']}}



################################################
### RETRIEVING ACCOUNTS AND HOUSEHOLD INFO #####

class UserId(Resource):

    def options(self):
        response_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '600',
        }
        return ('', 204, response_headers)


    def post(self):

        name = request.form['name']
        email = request.form['email']

        user = User.query.filter_by(email=email).first()
        if user:
            try:

                response = {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                }
                return make_response(response, 200)
            except Exception as e:
                return make_response({'error': str(e)}, 500)
        elif name != 'undefined':
            try:
                new_user = User(name=name, email=email)
                db.session.add(new_user)
                db.session.commit()
                new_household = Household(name=f"{name}'s Household", users=[new_user])
                db.session.add(new_household)
                db.session.commit()

                response = f'id={new_user.id}&name={new_user.name}&email={new_user.email}'

                return make_response(response, 200)
            except Exception as e:
                return make_response({'error': str(e)}, 500)

api.add_resource(UserId, '/api/user')


class AccountsByUser(Resource):

    def get(self, user_id):
        try:
            user_accounts = db.session.query(Account).join(AccountUser, Account.id == AccountUser.account_id).filter(AccountUser.user_id == user_id).all()
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

api.add_resource(TransactionsByUser, '/api/transactionhistory/<int:id>')


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

##############################
# AI TEXT PROMPT GENERATION ##

class GenerateAdvice(Resource):

    def options(self):
        response_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '600',
        }
        return ('', 204, response_headers)

    def post(self):
        try:
            request_data = request.form.get('prompt')
            print(request_data)
            ##PRE-RENDERED PROMPT##
            # content = model.generate_content('give me financial advice.')
            
            ##USER-GENERATED PROMPT##
            content = model.generate_content(request_data)
            print(content.text)
            return make_response({'content': content.text}, 200)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
api.add_resource(GenerateAdvice, '/api/advice')


if __name__ == '__main__':
    app.run(port=5555, debug=True)