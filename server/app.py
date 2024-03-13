#!/usr/bin/env python3

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api

# Model imports
from models import User

# Views go here:

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)