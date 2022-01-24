from flask import Blueprint, jsonify, request
from functools import wraps
from .utils import decode_jwt

auth = Blueprint('auth', __name__)


def is_admin(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization').split()[1]

        if not token:
            return jsonify({'message': 'Token is not included!'}), 403

        try:
            data = decode_jwt(token)
            if not data.is_admin:
                return jsonify({'message': 'You don\'t have access'}), 401

        except:
            return jsonify({'message': 'Token is invalid'}), 403

        return f(*args, **kwargs)

    return decorator

