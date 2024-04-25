from flask import jsonify
import requests


VIBER_PLAYLIST_NAME = "VIBER"


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
        json=payload,
    )

    if response.status_code == 201:
        return response.json(), 201
    else:
        return (
            jsonify({"error": "Failed to add playlist for user"}),
            response.status_code,
        )


def get_user_playlists(authorization, user_id):
    headers = {"Authorization": authorization}

    response = requests.get(
        f"https://api.spotify.com/v1/users/{user_id}/playlists", headers=headers
    )

    if response.status_code == 200:
        return response.json(), 200
    else:
        return (
            jsonify({"error": "Failed to get user playlists from Spotify API"}),
            response.status_code,
        )


def check_for_viber_playlist(user_playlists):
    print("\n User Playlists:")
    print(user_playlists)
    for playlist in user_playlists["items"]:
        print("\nplaylist: ")
        print(playlist)
        if playlist["name"] == VIBER_PLAYLIST_NAME:
            print("\nfound Viber playlist")
            return playlist
    print("\nno Viber playlist found")
    return False
