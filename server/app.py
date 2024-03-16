#!/usr/bin/env python3

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api

# Model imports
from models import User

# Views go here:

@app.route('/')
def index():
    return '<h1>Project Server</h1>'




# PLAID:

import base64
import os
import datetime as dt
import json
import time

from dotenv import load_dotenv
from flask import Flask, request, jsonify
import plaid
from plaid.model.payment_amount import PaymentAmount
from plaid.model.payment_amount_currency import PaymentAmountCurrency
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.recipient_bacs_nullable import RecipientBACSNullable
from plaid.model.payment_initiation_address import PaymentInitiationAddress
from plaid.model.payment_initiation_recipient_create_request import PaymentInitiationRecipientCreateRequest
from plaid.model.payment_initiation_payment_create_request import PaymentInitiationPaymentCreateRequest
from plaid.model.payment_initiation_payment_get_request import PaymentInitiationPaymentGetRequest
from plaid.model.link_token_create_request_payment_initiation import LinkTokenCreateRequestPaymentInitiation
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.asset_report_create_request import AssetReportCreateRequest
from plaid.model.asset_report_create_request_options import AssetReportCreateRequestOptions
from plaid.model.asset_report_user import AssetReportUser
from plaid.model.asset_report_get_request import AssetReportGetRequest
from plaid.model.asset_report_pdf_get_request import AssetReportPDFGetRequest
from plaid.model.auth_get_request import AuthGetRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.model.identity_get_request import IdentityGetRequest
from plaid.model.investments_transactions_get_request_options import InvestmentsTransactionsGetRequestOptions
from plaid.model.investments_transactions_get_request import InvestmentsTransactionsGetRequest
from plaid.model.accounts_balance_get_request import AccountsBalanceGetRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.investments_holdings_get_request import InvestmentsHoldingsGetRequest
from plaid.model.item_get_request import ItemGetRequest
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from plaid.model.transfer_authorization_create_request import TransferAuthorizationCreateRequest
from plaid.model.transfer_create_request import TransferCreateRequest
from plaid.model.transfer_get_request import TransferGetRequest
from plaid.model.transfer_network import TransferNetwork
from plaid.model.transfer_type import TransferType
from plaid.model.transfer_authorization_user_in_request import TransferAuthorizationUserInRequest
from plaid.model.ach_class import ACHClass
from plaid.model.transfer_create_idempotency_key import TransferCreateIdempotencyKey
from plaid.model.transfer_user_address_in_request import TransferUserAddressInRequest
from plaid.api import plaid_api

load_dotenv()


app = Flask(__name__)

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
# The payment_id is only relevant for the UK Payment Initiation product.
# We store the payment_id in memory - in production, store it in a secure
# persistent data store.
payment_id = None
# The transfer_id is only relevant for Transfer ACH product.
# We store the transfer_id in memory - in production, store it in a secure
# persistent data store.
transfer_id = None

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
    response.headers.add("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
    return response

@app.route('/api/create_link_token_for_payment', methods=['POST'])
def create_link_token_for_payment():
    global payment_id
    try:
        request = PaymentInitiationRecipientCreateRequest(
            name='John Doe',
            bacs=RecipientBACSNullable(account='26207729', sort_code='560029'),
            address=PaymentInitiationAddress(
                street=['street name 999'],
                city='city',
                postal_code='99999',
                country='GB'
            )
        )
        response = client.payment_initiation_recipient_create(
            request)
        recipient_id = response['recipient_id']

        request = PaymentInitiationPaymentCreateRequest(
            recipient_id=recipient_id,
            reference='TestPayment',
            amount=PaymentAmount(
                PaymentAmountCurrency('GBP'),
                value=100.00
            )
        )
        response = client.payment_initiation_payment_create(
            request
        )
        pretty_print_response(response.to_dict())
        
        # We store the payment_id in memory for demo purposes - in production, store it in a secure
        # persistent data store along with the Payment metadata, such as userId.
        payment_id = response['payment_id']
        
        linkRequest = LinkTokenCreateRequest(
            # The 'payment_initiation' product has to be the only element in the 'products' list.
            products=[Products('payment_initiation')],
            client_name='Plaid Test',
            # Institutions from all listed countries will be shown.
            country_codes=list(map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
            language='en',
            user=LinkTokenCreateRequestUser(
                # This should correspond to a unique id for the current user.
                # Typically, this will be a user ID number from your application.
                # Personally identifiable information, such as an email address or phone number, should not be used here.
                client_user_id=str(time.time())
            ),
            payment_initiation=LinkTokenCreateRequestPaymentInitiation(
                payment_id=payment_id
            )
        )

        if PLAID_REDIRECT_URI!=None:
            linkRequest['redirect_uri']=PLAID_REDIRECT_URI
        linkResponse = client.link_token_create(linkRequest)
        pretty_print_response(linkResponse.to_dict())
        response = jsonify(linkResponse.to_dict())
        response.headers.add("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
        return response
    except plaid.ApiException as e:
        return json.loads(e.body)


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
        response.headers.add("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
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
    global transfer_id
    public_token = request.form['public_token']
    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']
        response = jsonify(exchange_response.to_dict())
        response.headers.add("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
        return response
    except plaid.ApiException as e:
        return json.loads(e.body)






if __name__ == '__main__':
    app.run(port=5555, debug=True)