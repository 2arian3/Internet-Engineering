from flask import Blueprint, jsonify, request
from functools import wraps
from .utils import decode_jwt

auth = Blueprint('auth', __name__)


def is_token_valid(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization').split()[1]

        if not token:
            return jsonify({'message': 'Token is not included!'}), 403

        try:
            decode_jwt(token)
        except:
            return jsonify({'message': 'Token is invalid'}), 403

        return f(*args, **kwargs)

    return decorator


def is_admin(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        data = get_decoded_token()
        if not data.is_admin:
            return jsonify({'message': 'You don\'t have admin access'}), 401

        return f(*args, **kwargs)

    return decorator


def get_decoded_token():
    token = request.headers.get('Authorization').split()[1]

    return decode_jwt(token)
