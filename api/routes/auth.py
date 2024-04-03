from flask import request, jsonify, Blueprint, session, redirect
import requests
from urllib.parse import urlencode
import base64

from .utilities import helpers


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/generate_state", methods=["GET"])
def generate_state():
    session_token = helpers.get_secret_token()
    session["session_token"] = session_token
    return jsonify({"session_token": session_token})

@auth_bp.route("/get_admin_token", methods=["POST"])
def get_admin_token():
    client_id = request.form.get("client_id")
    client_secret = request.form.get("client_secret")

    # ! check if this function works without the harded-coded values then remove
    client_id = "49cf60e6226342958c119f100d66bdf6"
    client_secret = "d218b7960cd44529b7c4906aea895ad3"

    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    }

    headers = {"content-type": "application/x-www-form-urlencoded"}

    response = requests.post(
        "https://accounts.spotify.com/api/token", data=payload, headers=headers
    )

    if response.status_code == 200:
        return response.json(), 200
    else:
        return (
            jsonify({"error": "Failed to get token from Spotify API"}),
            response.status_code,
        )

@auth_bp.route("/get_auth_code", methods=["GET"])
def get_auth_code():
    client_id = request.args.get("client_id")
    base_url = "https://accounts.spotify.com/authorize"
    callback_url = "http://192.168.20.15:5000/auth/auth_callback"

    secret_string = helpers.get_secret_string(64)
    hashed_secret_string = helpers.get_hashed_secret_string(secret_string)
    code_challenge = helpers.get_base64_digest(hashed_secret_string)

    payload = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": callback_url,
        "state": 123, # ! need to get state session_token working
        "scope": "user-read-email user-read-private",
        "code_challenge_method": "S256",
        "code_challenge": code_challenge
    }

    query_string = urlencode(payload)
    auth_url = f"{base_url}?{query_string}"

    return redirect(auth_url)

@auth_bp.route("/auth_callback", methods=["GET"])
def handle_auth_callback():
    # Check if we didn"t receive an auth_code from spotify
    if not request.args.get("code"):
        print(request.args.get("error"))
        return "No auth code received from spotify"

    # Check if our state token was tampered with
    if int(request.args.get("state")) != 123: # ! need to get state session_token working
        print("(/auth_callback) -- State did not match session_token when receiving response")
        return "State <> session_token mismatch"

    auth_code = request.args.get("code")
    callback_url = "http://192.168.20.15:5000/auth/auth_callback"
    client_id = "49cf60e6226342958c119f100d66bdf6"
    client_secret = "d218b7960cd44529b7c4906aea895ad3"

    credentials = client_id + ":" + client_secret
    encoded_credentials = base64.b64encode(credentials.encode()).decode()
    authorization_code = "Basic " + encoded_credentials

    payload = {
        "grant_type": "client_credentials",
        "code": auth_code,
        "redirect": callback_url,
    }

    headers = {
        "content-type": "application/x-www-form-urlencoded",
        "authorization": authorization_code
    }

    response = requests.post(
        "https://accounts.spotify.com/api/token", data=payload, headers=headers
    )

    access_token = response.json()

    if response.status_code == 200:
        session["access_token"] = access_token
        print(f"myapp://192.168.20.15:8081/HomeScreen?success=true&access_token={access_token}")
        return redirect(f"exp://192.168.20.15:8081?success=true&access_token={access_token}")

    else:
        return (
            jsonify({"error": "Failed to get token from Spotify API"}),
            response.status_code,
        )
