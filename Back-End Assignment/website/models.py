from . import db
from sqlalchemy.sql import func


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Float(), nullable=True)
    comments = db.relationship('Comment', cascade="all, delete-orphan")
    __table_args__ = (
        db.CheckConstraint('0 <= rating & rating <= 1', name='rating should be between 0 and 1'),
        {})


class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role = db.Column(db.Integer, default=0, nullable=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    __table_args__ = (
        db.CheckConstraint('role == 0 or role == 1', name='role should be either 0 (simple user) or 1 (admin)'),
        {})
