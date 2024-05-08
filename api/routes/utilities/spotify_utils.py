from flask import jsonify
import requests
import json

from ..utilities import api_utils


VIBER_PLAYLIST_NAME = "VIBER"


# Adds a new playlist to the user
# Will only be called when the user does not yet have a vibr playlist
def add_viber_playlist(authorization, user_id):
    headers = {
        "Authorization": authorization,
        "Content-Type": "application/json",
    }
    payload = {
        "name": VIBER_PLAYLIST_NAME,
        "description": "Default playlist for Viber",
        "public": False,
    }

    response = requests.post(
        f"https://api.spotify.com/v1/users/{user_id}/playlists",
        headers=headers,
        data=payload,
    )

    if response.status_code == 201:
        return response.json(), 201
    else:
        return (
            jsonify({"error": "Failed to add playlist for user"}),
            response.status_code,
        )


# Returns a list of the current user's playlists
def get_user_playlists(authorization, user_id):
    headers = {"Authorization": authorization}

    response = requests.get(
        f"https://api.spotify.com/v1/users/{user_id}/playlists", headers=headers
    )

    user_playlists, status_code = api_utils.spotify_response(
        response,
        callback=api_utils.response_callback(
            success="Retrieved user playlists:",
            failure="Failed to Retrieve user playlists",
        ),
    )

    return user_playlists, status_code


# TODO: use the "total" value in the response combined with the current limit/offset to
# TODO: to determine if we need to call this function again
def get_top_items(authorization):
    headers = {"Authorization": authorization}
    params = {"time_range": "short_term", "limit": 10, "offset": 0}

    response = requests.get(
        f"https://api.spotify.com/v1/me/top/artists", headers=headers, params=params
    )

    if response.status_code == 200:
        print("\ntop_items:\n")
        print(json.dumps(response.json(), indent=4))
        return response.json(), 200
    else:
        return jsonify({"error": "failed to get the user's top items from Spotify API"})


# Checks if the user already has a viber playlist
# If so, return it
def check_for_viber_playlist(user_playlists):
    for playlist in user_playlists["items"]:
        if playlist["name"] == VIBER_PLAYLIST_NAME:
            return playlist
    return False
