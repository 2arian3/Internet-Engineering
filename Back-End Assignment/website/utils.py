from . import ALGORITHM, SECRET_KEY
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime


def generate_hash(password):
    return generate_password_hash(password, method='sha256')


def check_hash(hashed_password, entered_password):
    return check_password_hash(hashed_password, entered_password)


def row_to_dict(row):
    return {c.name: str(getattr(row, c.name)) for c in row.__table__.columns}


def decode_jwt(token):
    try:
        data = jwt.decode(token, SECRET_KEY, ALGORITHM)
        return JWT(data)
    except:
        raise Exception('Invalid Token')


'''
The expiration date should be less than 10 days for sure:)
It is just for testing
'''
def encode_jwt(user_id, is_admin=False):
    return jwt.encode({
        'user_id': user_id,
        'is_admin': is_admin,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=10)
    }, SECRET_KEY)


class JWT:
    def __init__(self, decoded_token):
        self.user_id = decoded_token['user_id']
        self.is_admin = decoded_token['is_admin']
        self.exp = decoded_token['exp']
