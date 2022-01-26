from . import db
from sqlalchemy.sql import func


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Float(), nullable=True, default=0)
    votes = db.relationship('Vote', backref='movie', cascade='all, delete-orphan', lazy=True)
    comments = db.relationship('Comment', backref='movie', cascade='all, delete-orphan', lazy=True)
    __table_args__ = (
        db.CheckConstraint('0 <= rating & rating <= 1', name='Overall rating should be between 0 and 1'),
        {})

    def compute_rating(self):
        self.rating = sum([vote.rating for vote in self.votes]) / (len(self.votes) * 100) if len(self.votes) else 0
        db.session.commit()


class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    __table_args__ = (
        db.CheckConstraint('0 <= rating & rating <= 100', name='Rating should be between 0 and 100'),
        {})


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)


class User(db.Model):
    # You should change role in database
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role = db.Column(db.Integer, default=0, nullable=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    comments = db.relationship('Comment', backref='user', cascade='all, delete-orphan', lazy=True)
    votes = db.relationship('Vote', backref='user', cascade='all, delete-orphan', lazy=True)
    __table_args__ = (
        db.CheckConstraint('role == 0 or role == 1', name='role should be either 0 (simple user) or 1 (admin)'),
        {})
