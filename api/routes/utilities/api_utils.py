from functools import wraps
from flask import request

import json


# Checks that a session_token has been provided before attempting the API call
def require_session_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        session_token = request.args.get("session_token")
        if not session_token:
            return "Missing session_token parameter", 400
        return func(*args, **kwargs)

    return wrapper


# Checks that a session_token has been provided before attempting the API call
def require_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        authorization = request.headers.get("Authorization")
        if not authorization:
            return "Missing authorization parameter", 400
        return func(*args, **kwargs)

    return wrapper


def spotify_response(response, callback=None):
    if response.status_code // 100 != 2:
        error_message = response.json().get("error", "Failed to process request")
        raise Exception(f"HTTP Error: {response.status_code}, {error_message}")

    data = response.json()

    if callback:
        callback(data)

    return data


def response_callback(success, failure):
    def callback(data):
        if data:
            print("\n" + success)
            print(json.dumps(data, indent=4))
        else:
            print("\n" + failure, data)

    return callback
