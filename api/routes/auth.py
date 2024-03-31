from flask import request, jsonify, Blueprint
import requests

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route("/spotify_token", methods=["POST"])
def get_spotify_token():
    client_id = request.form.get("client_id")
    client_secret = request.form.get("client_secret")

    client_id = '49cf60e6226342958c119f100d66bdf6'
    client_secret = 'd218b7960cd44529b7c4906aea895ad3'

    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

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
