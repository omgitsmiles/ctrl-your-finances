#!/usr/bin/env python3

import os
import json
import time

# Remote library imports
from flask import request, jsonify, make_response
from flask_restful import Resource
from dotenv import load_dotenv

# Local imports
from config import app, db, api

# Model imports
from models import User, PlaidItem, Transaction

# Views go here:

@app.route('/')
def index():
    return '<h1>Project Server</h1>'




# PLAID:

import plaid
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.api import plaid_api

load_dotenv()

# Fill in your Plaid API keys - https://dashboard.plaid.com/account/keys
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
# Use 'sandbox' to test with Plaid's Sandbox environment (username: user_good,
# password: pass_good)
# Use `development` to test with live users and credentials and `production`
# to go live
PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')
# PLAID_PRODUCTS is a comma-separated list of products to use when initializing
# Link. Note that this list must contain 'assets' in order for the app to be
# able to create and retrieve asset reports.
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')

# PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
# will be able to select institutions from.
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

# Parameters used for the OAuth redirect Link flow.
#
# Set PLAID_REDIRECT_URI to 'http://localhost:3000/'
# The OAuth redirect flow requires an endpoint on the developer's website
# that the bank website should redirect to. You will need to configure
# this redirect URI for your client ID through the Plaid developer dashboard
# at https://dashboard.plaid.com/team/api.
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

# We store the access_token in memory - in production, store it in a secure
# persistent data store.
access_token = None

item_id = None


@app.route('/api/info', methods=['POST'])
def info():
    global access_token
    global item_id 
    response = jsonify({
        'item_id': item_id,
        'access_token': access_token,
        'products': PLAID_PRODUCTS
    })
    # print("RESPONSE FROM: /api/info")
    # print("access_token: ", access_token)
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
    global access_token
    global item_id
    public_token = request.form['public_token']
    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']

        # save token and id to database.  MUST ENCRYPT THIS.
        # CAN THIS BE DONE ASYNC?
        new_plaid_item = PlaidItem(access_token=access_token, item_id=item_id)
        db.session.add(new_plaid_item)
        db.session.commit()

        response = jsonify(exchange_response.to_dict())
        # print("RESPONSE FROM /api/set_access_token")
        # print(exchange_response.to_dict())
        return response
    except plaid.ApiException as e:
        return json.loads(e.body)


# Retrieve Transactions for an Item
# https://plaid.com/docs/#transactions

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    # Set cursor to empty to receive all historical updates
    cursor = ''

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
            pretty_print_response(response)

            # update plaid_items row cursor based on access token
            plaid_item = PlaidItem.query.filter_by(access_token=access_token).first()
            plaid_item.cursor = cursor

        # add transactions to database.  CAN THIS BE DONE ASYNC?
        new_transactions = []
        for transaction in added:
            new_transaction = Transaction(
                user_id = None,
                plaid_item_id = None,
                amount = transaction['amount'],
                authorized_date = transaction['authorized_date'],
                merchant_name = transaction['merchant_name'],
                name = transaction['name'],
                personal_finance_category = json.dumps(transaction['personal_finance_category']),
                # to retrieve personal_finance_category from transactions table, transform data with json.loads(transaction['personal_finance_category'])
                transaction_id = transaction['transaction_id']
            )
            new_transactions.append(new_transaction)
        db.session.add_all(new_transactions)
        db.session.commit()

        # Return the 8 most recent transactions
        latest_transactions = sorted(added, key=lambda t: t['date'])[-8:]
        response = jsonify({
            'latest_transactions': latest_transactions})
        return response

    except plaid.ApiException as e:
        error_response = format_error(e)
        return jsonify(error_response)

def pretty_print_response(response):
    print(json.dumps(response, indent=2, sort_keys=True, default=str))



if __name__ == '__main__':
    app.run(port=5555, debug=True)