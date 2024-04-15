from flask import request, jsonify, Blueprint
import requests

spotify_bp = Blueprint("spotify", __name__, url_prefix="/spotify")


@spotify_bp.route("/get_user_details", methods=["GET"])
def get_user_details():
    print("calling /get_user_details")
    print("\nThese headers passed in:")
    print(request.headers)
    headers = {"Authorization": request.headers.get("Authorization")}
    print("\ncalling with these headers:")
    print(headers)
    response = requests.get("https://api.spotify.com/v1/me", headers=headers)
    print(response)
    return response.json()
