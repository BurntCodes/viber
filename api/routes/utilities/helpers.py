import secrets
import string
import hashlib
import base64

def get_secret_string(length):
    possible_chars = string.ascii_letters + string.digits
    random_values = []

    for _ in range(length):
        random_value = secrets.randbelow(len(possible_chars))
        random_values.append(random_value)

    return ''.join(possible_chars[i] for i in random_values)

def get_hashed_secret_string(secret_string):
    sha256_hash = hashlib.sha256()
    sha256_hash.update(secret_string.encode())
    return sha256_hash

def get_base64_digest(hash):
    digest_bytes = hash.digest()
    base64_digest = base64.b64encode(digest_bytes).decode()
    return base64_digest

def get_secret_token():
    token = secrets.token_urlsafe(16)
    return token

