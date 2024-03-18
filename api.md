Plaid response data:

For a user's spending analysis, we will want the user's transaction details over the past several months.  The exact time period may vary depending on the level of analysis we want to provide.  For that information, we would make requests to to Plaid for a user's transaction information.  A post to **/transactions/sync/**, which would provide updated transaction details to our database, returns an array of transaction objects with the following format:

```
    {
      "account_id": "DD3wg4jvrEFljEVWV1wzI5Zwrvp3WeI3N4azP",
      "account_owner": null,
      "amount": 89.4,
      "authorized_date": "2023-12-21",
      "authorized_datetime": null,
      "category": [
        "Food and Drink",
        "Restaurants"
      ],
      "category_id": "13005000",
      "check_number": null,
      "counterparties": [
        {
          "confidence_level": "LOW",
          "entity_id": null,
          "logo_url": null,
          "name": "FUN",
          "phone_number": null,
          "type": "merchant",
          "website": null
        }
      ],
      "date": "2023-12-22",
      "datetime": null,
      "iso_currency_code": "USD",
      "location": {
        "address": null,
        "city": null,
        "country": null,
        "lat": null,
        "lon": null,
        "postal_code": null,
        "region": null,
        "store_number": null
      },
      "logo_url": null,
      "merchant_entity_id": null,
      "merchant_name": "FUN",
      "name": "SparkFun",
      "payment_channel": "in store",
      "payment_meta": {
        "by_order_of": null,
        "payee": null,
        "payer": null,
        "payment_method": null,
        "payment_processor": null,
        "ppd_id": null,
        "reason": null,
        "reference_number": null
      },
      "pending": false,
      "pending_transaction_id": null,
      "personal_finance_category": {
        "confidence_level": "LOW",
        "detailed": "GENERAL_MERCHANDISE_OTHER_GENERAL_MERCHANDISE",
        "primary": "GENERAL_MERCHANDISE"
      },
      "personal_finance_category_icon_url": "https://plaid-category-icons.plaid.com/PFC_GENERAL_MERCHANDISE.png",
      "transaction_code": null,
      "transaction_id": "WDE4apg9oBF1Nk8x879VuoynV4PKd3c6QQZ8a",
      "transaction_type": "place",
      "unofficial_currency_code": null,
      "website": null
    },
```


Post to **/item/get/** retrieves information about an Item, like the institution, billed products, available products, and webhook information. This is the format of the returned object:
```
{
  "item": {
    "available_products": [
      "assets",
      "balance",
      "signal",
      "identity_match",
      "income_verification",
      "liabilities",
      "recurring_transactions",
      "transfer"
    ],
    "billed_products": [
      "auth",
      "identity",
      "transactions"
    ],
    "consent_expiration_time": null,
    "error": null,
    "institution_id": "ins_14",
    "item_id": "MDeZyRGm1nFam9zWzKlQFn7xLLmlbpF9d4w8j",
    "products": [
      "auth",
      "identity",
      "transactions"
    ],
    "update_type": "background",
    "webhook": ""
  },
  "request_id": "7Y9PfCAENboQ9Wd",
  "status": {
    "last_webhook": null,
    "transactions": {
      "last_failed_update": null,
      "last_successful_update": "2024-03-15 13:25:01.056000+00:00"
    }
  }
}
{
  "institution": {
    "country_codes": [
      "US"
    ],
    "institution_id": "ins_14",
    "name": "TD Bank",
    "oauth": false,
    "products": [
      "assets",
      "auth",
      "balance",
      "transactions",
      "signal",
      "identity_match",
      "income",
      "income_verification",
      "identity",
      "liabilities",
      "processor_payments",
      "recurring_transactions",
      "transfer"
    ],
    "routing_numbers": [
      "011103093",
      "011202910",
      "011305749",
      "011400071",
      "011600033",
      "011600525",
      "011600570",
      "021200957",
      "021201503",
      "021205871",
      "021207138",
      "021207413",
      "021302567",
      "021307708",
      "021912915",
      "026003243",
      "026013673",
      "026014193",
      "031101017",
      "031201328",
      "031201360",
      "031207801",
      "031901482",
      "036001808",
      "053201885",
      "053902197",
      "054001725",
      "063112809",
      "063113772",
      "063115631",
      "067011142",
      "067014822",
      "211274450",
      "211370095",
      "211370493",
      "211370545",
      "263170175"
    ]
  },
  "request_id": "0VMZkrdEwNYpVOq"
}
```


Post to **/accounts/get** retrieves high-level information about all accounts associated with an item:
```
{
  "accounts": [
    {
      "account_id": "DD3wg4jvrEFljEVWV1wzI5Zwrvp3WeI3N4azP",
      "balances": {
        "available": 100.0,
        "current": 110.0,
        "iso_currency_code": "USD",
        "limit": null,
        "unofficial_currency_code": null
      },
      "mask": "0000",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Standard 0% Interest Checking",
      "persistent_account_id": "8cfb8beb89b774ee43b090625f0d61d0814322b43bff984eaf60386e",
      "subtype": "checking",
      "type": "depository"
    },
    {
      "account_id": "VD8gdwG9XzFMbygAgBmVcD4mrXA3Gki9QqP64",
      "balances": {
        "available": 200.0,
        "current": 210.0,
        "iso_currency_code": "USD",
        "limit": null,
        "unofficial_currency_code": null
      },
      "mask": "1111",
      "name": "Plaid Saving",
      "official_name": "Plaid Silver Standard 0.1% Interest Saving",
      "persistent_account_id": "211a4e5d8361a3afb7a3886362198c7306e00a313b5aa944c20d34b6",
      "subtype": "savings",
      "type": "depository"
    }
  ],
  "item": {
    "available_products": [
      "assets",
      "balance",
      "signal",
      "identity_match",
      "income_verification",
      "liabilities",
      "recurring_transactions",
      "transfer"
    ],
    "billed_products": [
      "auth",
      "identity",
      "transactions"
    ],
    "consent_expiration_time": null,
    "error": null,
    "institution_id": "ins_14",
    "item_id": "MDeZyRGm1nFam9zWzKlQFn7xLLmlbpF9d4w8j",
    "products": [
      "auth",
      "identity",
      "transactions"
    ],
    "update_type": "background",
    "webhook": ""
  },
  "request_id": "REgUPvV3EwH0DDO"
}
```





When using Plaid Link, this is the response from **/api/set_access_token**
```
{
  'access_token': 'access-sandbox-secret_token_number',
  'item_id': 'blMRjQBQadH5LKrRA4PGFN4WleyXkZuVPQ9Jq', 
  'request_id': 'CpZcSZGBrzBqQ7J'
}
```
Note that even for the sandbox, a different access token is created every time a user links to an account.