from flask import Blueprint, request, jsonify
from . import db
from .models import Movie, User, Vote, Comment
from .auth import is_admin
from .utils import row_to_dict

views = Blueprint('views', __name__)


@views.route('/comments', methods=['GET'])
def get_comments():
    movie_id = request.args.get('movie')
    if movie_id:
        try:
            movie_id = int(movie_id)
            comments = Comment.query.filter_by(movie_id=movie_id).first()
            if comments:
                return 'OK', 200
            else:
                raise Exception()
        except ValueError:
            return jsonify({'message': 'Invalid movie id'}), 400
        except:
            return jsonify({'message': 'Bad gateway'}), 502

    return jsonify({'message': 'Enter movie id'}), 400


@views.route('/movies', methods=['GET'])
def get_movies():
    movie_id = request.args.get('id')
    if movie_id:
        try:
            movie_id = int(movie_id)
            movie = Movie.query.filter_by(id=movie_id).first()
            if movie:
                return jsonify({'movie': row_to_dict(movie)}), 200
            else:
                raise Exception()
        except ValueError:
            return jsonify({'message': 'Invalid movie id'}), 400
        except:
            return jsonify({'message': 'Bad gateway'}), 502

    return jsonify({'movies': [row_to_dict(movie) for movie in Movie.query.all()]}), 200


@views.route('/user/vote', methods=['POST'])
def post_vote():
    body = request.json
    return 'Hello World!'


@views.route('/user/comment', methods=['POST'])
def post_comment():
    body = request.json
    return 'Hello World!'


@views.route('/admin/movie', methods=['POST', 'PUT', 'DELETE'])
@is_admin
def admin_movie():
    movie_id = request.args.get('id')
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
            else:
                raise Exception()
        except ValueError:
            return jsonify({'message': 'Invalid movie id'}), 400
        except Exception as e:
            print(e)
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

    return jsonify({'message': 'Enter movie id'}), 400


@views.route('/admin/comment', methods=['PUT', 'DELETE'])
@is_admin
def approve_comment():
    comment_id = request.args.get('id')
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
            else:
                raise Exception()
        except ValueError:
            return jsonify({'message': 'Invalid comment id'}), 400
        except:
            return jsonify({'message': 'Bad gateway'}), 502

    return jsonify({'message': 'Enter comment id'}), 400
