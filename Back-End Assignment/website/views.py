from flask import Blueprint, request, jsonify
from . import db
from .models import Movie, User, Vote, Comment
from .auth import is_admin, is_token_valid, get_decoded_token
from .utils import row_to_dict, check_hash, generate_hash, encode_jwt

views = Blueprint('views', __name__)


@views.route('/', methods=['GET', 'POST'])
@views.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        body = request.json
        if 'username' in body and type(body['username']) == str \
                and 'password' in body and type(body['password']) == str:
            user = User.query.filter_by(username=body['username']).first()
            if not user:
                return jsonify({'message': 'Entered user does not exist or username is incorrect'}), 401

            if check_hash(user.password, body['password']):
                return jsonify({'token': encode_jwt(user_id=user.id, is_admin=(user.role == 1))}), 200

            else:
                return jsonify({'message': 'Incorrect password'}), 401

        else:
            return jsonify({'message': 'Invalid body (Include username and password as string in body)'}), 403

    return jsonify({'message': 'Enter username and password using POST method'}), 400


@views.route('/signup', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        body = request.json
        if 'username' in body and type(body['username']) == str \
                and 'password' in body and type(body['password']) == str:
            user = User.query.filter_by(username=body['username']).first()
            if user:
                return jsonify({'message': 'Entered username already exists'}), 409
            user = User(username=body['username'], password=generate_hash(body['password']))
            db.session.add(user)
            db.session.commit()

            user = User.query.filter_by(username=body['username']).first()
            return jsonify({'token': encode_jwt(user_id=user.id, is_admin=(user.role == 1))}), 201
        else:
            return jsonify({'message': 'Invalid body (Include username and password as string in body)'}), 403

    return jsonify({'message': 'Enter username and password using POST method'}), 400


@views.route('/comments', methods=['GET'])
def get_comments():
    movie_id = request.args.get('movie')
    if movie_id:
        try:
            movie_id = int(movie_id)
            movie = Movie.query.filter_by(id=movie_id).first()
            if not movie:
                return jsonify({'message': 'Movie not found'}), 404

            comments = Comment.query.join(User, Comment.user_id == User.id)\
                .add_columns(User.username, Comment.id, Comment.comment, Comment.movie_id, Comment.approved)\
                .filter(Comment.movie_id == movie_id)
            comments = [comment for comment in comments if comment.approved]
            return jsonify({'movie': movie.name, 'comments': [{
                'id': comment.id,
                'author': comment.username,
                'body': comment.comment
            } for comment in comments]}), 200
        except ValueError:
            return jsonify({'message': 'Invalid movie id'}), 400
        except:
            return jsonify({'message': 'Bad gateway'}), 502

    return jsonify({'message': 'Enter movie id'}), 400


@views.route('/movies', methods=['GET'], defaults={'movie_id': None})
@views.route('/movie/<movie_id>', methods=['GET'])
def get_movies(movie_id):
    if movie_id:
        try:
            movie_id = int(movie_id)
            movie = Movie.query.filter_by(id=movie_id).first()
            if movie:
                return jsonify(row_to_dict(movie)), 200
            return jsonify({'message': 'Movie not found'}), 404
        except ValueError:
            return jsonify({'message': 'Invalid movie id'}), 400
        except:
            return jsonify({'message': 'Bad gateway'}), 502

    return jsonify({'movies': [row_to_dict(movie) for movie in Movie.query.all()]}), 200


@views.route('/user/vote', methods=['POST'])
@is_token_valid
def post_vote():
    body = request.json
    if 'movie_id' in body and type(body['movie_id']) == int \
            and 'vote' in body and (type(body['vote']) == int or type(body['vote']) == float):
        movie = Movie.query.filter_by(id=body['movie_id']).first()
        if not movie:
            return jsonify({'message': 'Entered movie_id is incorrect'}), 401

        if not (0 <= body['vote'] <= 100):
            return jsonify({'message': 'Vote should be a number between 0 and 100'}), 400

        decoded_token = get_decoded_token()
        user = User.query.filter_by(id=decoded_token.user_id).first()
        if user:
            vote = Vote(rating=body['vote'], user_id=user.id, movie_id=movie.id)
            db.session.add(vote)
            db.session.commit()
            movie.compute_rating()
            return 'Ok', 204
        else:
            return jsonify({'message': 'User not found'}), 401

    return jsonify({'message': 'Enter movie_id as int and vote as float using POST method'}), 400


@views.route('/user/comment', methods=['POST'])
@is_token_valid
def post_comment():
    body = request.json
    if 'movie_id' in body and type(body['movie_id']) == int \
            and 'comment_body' in body and type(body['comment_body']) == str:
        movie = Movie.query.filter_by(id=body['movie_id']).first()
        if not movie:
            return jsonify({'message': 'Entered movie_id is incorrect'}), 401

        decoded_token = get_decoded_token()
        user = User.query.filter_by(id=decoded_token.user_id).first()
        if user:
            comment = Comment(comment=body['comment_body'], user_id=user.id, movie_id=movie.id)
            db.session.add(comment)
            db.session.commit()
            return 'Ok', 200
        else:
            return jsonify({'message': 'User not found'}), 401

    return jsonify({'message': 'Enter movie_id as int and comment_body as string using POST method'}), 400


@views.route('/admin/movie', methods=['POST', 'PUT', 'DELETE'], defaults={'movie_id': None})
@views.route('/admin/movie/<movie_id>', methods=['POST', 'PUT', 'DELETE'])
@is_token_valid
@is_admin
def admin_movie(movie_id):
    if movie_id and request.method != 'POST':
        try:
            movie_id = int(movie_id)
            if request.method == 'PUT':
                body = request.json
                if 'name' in body and type(body['name']) == str \
                        and 'description' in body and type(body['description']) == str:
                    movie = Movie.query.filter_by(id=movie_id).first()
                    movie.name = body['name']
                    movie.description = body['description']
                    db.session.commit()
                    return '', 204
                else:
                    return jsonify({'message': 'Invalid body'}), 400
            elif request.method == 'DELETE':
                db.session.delete(Movie.query.filter_by(id=movie_id).first())
                db.session.commit()
                return '', 204
        except ValueError:
            return jsonify({'message': 'Invalid movie id'}), 400
        except:
            return jsonify({'message': 'Bad gateway'}), 502
    elif request.method == 'POST':
        try:
            body = request.json
            if 'name' in body and type(body['name']) == str \
                    and 'description' in body and type(body['description']) == str:
                movie = Movie(name=body['name'], description=body['description'])
                db.session.add(movie)
                db.session.commit()
                return '', 204
            else:
                return jsonify({'message': 'Invalid body'}), 400
        except:
            return jsonify({'message': 'Bad gateway'}), 502

    return jsonify({'message': 'Enter movie id in the path'}), 400


@views.route('/admin/comment', methods=['PUT', 'DELETE'], defaults={'comment_id': None})
@views.route('/admin/comment/<comment_id>', methods=['PUT', 'DELETE'])
@is_token_valid
@is_admin
def approve_comment(comment_id):
    if comment_id:
        try:
            comment_id = int(comment_id)
            if request.method == 'PUT':
                body = request.json
                if 'approved' in body and type(body['approved']) == bool:
                    comment = Comment.query.filter_by(id=comment_id).first()
                    comment.approved = body['approved']
                    db.session.commit()
                    return '', 204
                else:
                    return jsonify({'message': 'Invalid body'}), 400
            elif request.method == 'DELETE':
                db.session.delete(Comment.query.filter_by(id=comment_id).first())
                db.session.commit()
                return '', 204
        except ValueError:
            return jsonify({'message': 'Invalid comment id'}), 400
        except:
            return jsonify({'message': 'Bad gateway'}), 502

    return jsonify({'message': 'Enter comment id'}), 400
