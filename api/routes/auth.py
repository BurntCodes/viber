from flask import request, jsonify, Blueprint, redirect
from urllib.parse import urlencode
import requests
import base64

from .utilities import auth_utils


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

tokens = {}

# TODO: Obfuscate these:
CLIENT_ID = "49cf60e6226342958c119f100d66bdf6"
CLIENT_SECRET = "d218b7960cd44529b7c4906aea895ad3"


@auth_bp.route("/generate_session_token", methods=["GET"])
def generate_session_token():
    session_token = auth_utils.get_secret_token()
    tokens["session_token"] = session_token
    return jsonify({"session_token": session_token})


@auth_bp.route("/get_admin_token", methods=["POST"])
def get_admin_token():
    headers = {"content-type": "application/x-www-form-urlencoded"}

    payload = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    response = requests.post(
        "https://accounts.spotify.com/api/token",
        headers=headers,
        data=payload,
    )

    if response.status_code == 200:
        return response.json(), 200
    else:
        return (
            jsonify({"error": "Failed to get token from Spotify API"}),
            response.status_code,
        )


@auth_bp.route("/get_auth_code", methods=["GET"])
@auth_utils.require_session_token  # ?
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
        "scope": (
            "user-read-email "
            "user-read-private "
            "playlist-modify-public "
            "playlist-modify-private "
            "playlist-read-private "
            "playlist-read-collaborative "
        ),
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

    callback_url = (
        "http://192.168.20.15:5000/auth/auth_callback"  # for validation purposes only
    )

    authorization_code = (
        "Basic " + base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    )

    headers = {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": authorization_code,
    }

    payload = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": callback_url,
    }

    response = requests.post(
        "https://accounts.spotify.com/api/token",
        headers=headers,
        data=payload,
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
