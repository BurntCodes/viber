from functools import wraps
from flask import request

import json


def require_session_token(func):
    """
    Ensures that a session token is provided before executing the API call.

    Parameters:
    func (function): The function to be wrapped.

    Returns:
    function: Wrapped function that checks for the presence of a session token.
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        session_token = request.args.get("session_token")
        if not session_token:
            return "Missing session_token parameter", 400
        return func(*args, **kwargs)

    return wrapper


def require_auth(func):
    """
    Ensures that an authorization token is provided before executing the API call.

    Parameters:
        func (function): The function to be wrapped.

    Returns:
        function: Wrapped function that checks for the presence of an authorization token.
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        authorization = request.headers.get("Authorization")
        if not authorization:
            return "Missing authorization parameter", 400
        return func(*args, **kwargs)

    return wrapper


def spotify_response(response, callback=None):
    """
    All-purpose function for handling responses from the spotify API.
    Processes a response from the Spotify API and handles errors.

    Parameters:
        response (Response): The response object from the initial API call from our Route.
        callback (function, optional): A callback function to be executed once error handling is completed.

    Returns:
        tuple: A tuple containing the JSON data (data) from the response and the status code (status_code).
    """

    data = response.json()
    status_code = response.status_code

    if status_code // 100 != 2:
        error_message = data.get("error", "Failed to process request")
        raise Exception(f"HTTP Error: {status_code}, {error_message}")

    if callback:
        callback(data)

    return data, status_code


def response_callback(success, failure):
    """
    Creates a callback function for processing and displaying data from spotify API responses.
    Mainly used for logging purposes to print the contents of a Spotify API response object to the console.

    Parameters:
        success (str): Message to print if data is present in the response.
        failure (str): Message to print if no data is present in the response.

    Returns:
        function: The callback function..
    """

    def callback(data):
        if data:
            print("\n" + success)
            print(json.dumps(data, indent=4))
        else:
            print("\n" + failure, data)

    return callback
