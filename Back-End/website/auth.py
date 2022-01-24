from flask import Blueprint, jsonify, request
from functools import wraps
from . import SECRET_KEY
import jwt

auth = Blueprint('auth', __name__)


def is_admin(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization').split()[1]

        if not token:
            return jsonify({'message': 'Token is not included!'}), 403

        try:
            data = jwt.decode(token, SECRET_KEY, 'HS256')
            if not data['admin']:
                return jsonify({'message': 'You don\'t have access'}), 401

        except:
            return jsonify({'message': 'Token is invalid'}), 403

        return f(*args, **kwargs)

    return decorator

