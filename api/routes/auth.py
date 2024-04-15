from flask import request, jsonify, Blueprint, redirect
import requests
from urllib.parse import urlencode
import base64

from .utilities import helpers


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

tokens = {}


@auth_bp.route("/generate_session_token", methods=["GET"])
def generate_session_token():
    session_token = helpers.get_secret_token()
    tokens["session_token"] = session_token
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
@helpers.require_session_token
def get_auth_code():
    session_token = request.args.get("session_token")
    if session_token != tokens.get("session_token"):
        return "Missing session_token parameter", 400

    client_id = request.args.get("client_id")
    base_url = "https://accounts.spotify.com/authorize"
    callback_url = "http://192.168.20.15:5000/auth/auth_callback"

    payload = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": callback_url,
        "state": session_token,
        "scope": "user-read-email user-read-private",
    }

    query_string = urlencode(payload)
    auth_url = f"{base_url}?{query_string}"

    return redirect(auth_url)


@auth_bp.route("/auth_callback", methods=["GET"])
def handle_auth_callback():
    auth_code = request.args.get("code")

    # Check if we didn't receive an auth_code from spotify
    if not request.args.get("code"):
        print(request.args.get("error"))
        return "No auth code received from spotify"

    session_token = request.args.get("state")

    # Check if our session token was tampered with
    if session_token != tokens.get("session_token"):
        print(
            "(/auth_callback) -- State did not match session_token when receiving response"
        )
        return "State <> session_token mismatch"

    callback_url = "http://192.168.20.15:5000/auth/auth_callback"
    client_id = "49cf60e6226342958c119f100d66bdf6"
    client_secret = "d218b7960cd44529b7c4906aea895ad3"

    authorization_code = (
        "Basic " + base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    )

    payload = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": callback_url,
    }

    headers = {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": authorization_code,
    }

    response = requests.post(
        "https://accounts.spotify.com/api/token", data=payload, headers=headers
    )

    access_token = response.json()
    redirect_url = f"exp://192.168.20.15:8081/?success=true&access_token={access_token}"

    if response.status_code == 200:
        tokens["access_token"] = access_token
        return redirect(redirect_url)

    else:
        return (
            jsonify({"error": "Failed to get token from Spotify API"}),
            response.status_code,
        )
