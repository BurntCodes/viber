from flask import request, jsonify, Blueprint
import requests
import json

from .utilities import spotify_utils, api_utils as api

spotify_bp = Blueprint("spotify", __name__, url_prefix="/spotify")


@spotify_bp.route("/get_user_details", methods=["GET"])
@api.require_auth
def get_user_details():
    headers = {"Authorization": request.headers.get("Authorization")}

    response = requests.get("https://api.spotify.com/v1/me", headers=headers)

    if response.status_code == 200:
        return response.json(), 200
    else:
        return (
            jsonify({"error": "Failed to get user details from Spotify API"}),
            response.status_code,
        )


@spotify_bp.route("/get_viber_playlist", methods=["GET"])
@api.require_auth
def get_viber_playlist():
    authorization = request.headers.get("Authorization")
    user_id = request.args.get("user_id")

    # Try and fetch the user's current playlists
    user_playlists_response = spotify_utils.get_user_playlists(
        authorization=authorization, user_id=user_id
    )
    if user_playlists_response[1] != 200:
        return user_playlists_response
    user_playlists = user_playlists_response[0]

    # Of the user's current playlists, try and get the Viber playlist
    viber_playlist = spotify_utils.check_for_viber_playlist(user_playlists)

    # If we don't have a Viber playlist, try and make one, then return it
    if not viber_playlist:
        add_viber_playlist_response = spotify_utils.add_viber_playlist(
            authorization=authorization, user_id=user_id
        )
        if add_viber_playlist_response[1] != 201:
            return add_viber_playlist_response

        viber_playlist = add_viber_playlist_response[0]

    top_artists = spotify_utils.get_top_artists(authorization=authorization)[0]
    recs = spotify_utils.get_recs(authorization=authorization, seed_data=top_artists)[0]

    viber_data = {"viberPlaylist": viber_playlist, "recData": recs}

    return viber_data


@spotify_bp.route("/add_track_to_playlist", methods=["POST"])
@api.require_auth
def add_track_to_playlist():
    post_data = request.json
    track_data = post_data.get("track")
    track_uri = track_data.get("uri")

    playlist_data = post_data.get("playList")
    playlist_id = playlist_data.get("id")

    headers = {
        "Authorization": request.headers.get("Authorization"),
        "Content-Type": "application/json",
    }
    payload = {"uris": [track_uri]}

    response = requests.post(
        f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks",
        headers=headers,
        json=payload,
    )

    if response.status_code == 200:
        print("track added to playlist:")
        print(json.dumps(track_data, indent=4))
        return response.json(), 200
    else:
        return (
            jsonify({"error": "Failed to add track to viberPlaylist"}),
            response.status_code,
        )


@spotify_bp.route("get_next_recs", methods=[])
@api.require_auth
def get_next_recs():
    authorization = request.headers.get("Authorization")
    seed_data = request.args.get("seedData")

    recs = spotify_utils.get_recs(authorization=authorization, seed_data=seed_data)

    return recs
