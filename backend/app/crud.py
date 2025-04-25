from sqlalchemy.orm import Session
from app import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username = user.username,
        email = user.email,
        hashed_password = hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_tweet(db: Session, tweet: schemas.TweetCreate, user_id: int):
    db_tweet = models.Tweet(
        content=tweet.content,
        author_id=user_id
    )
    db.add(db_tweet)
    db.commit()
    db.refresh(db_tweet)
    return db_tweet

def get_tweets(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Tweet).offset(skip).limit(limit).all()

def get_tweet_by_id(db: Session, tweet_id: int):
    return db.query(models.Tweet).filter(models.Tweet.id == tweet_id).first()

def update_tweet(db: Session, tweet_id: int, content: str):
    db_tweet = get_tweet_by_id(db, tweet_id)
    if db_tweet:
        db_tweet.content = content
        db.commit()
        db.refresh(db_tweet)
    return db_tweet

def delete_tweet(db: Session, tweet_id: int):
    db_tweet = get_tweet_by_id(db, tweet_id)
    if db_tweet:
        db.delete(db_tweet)
        db.commit()
    return db_tweet

def search_tweets(db: Session, query: str):
    return db.query(models.Tweet).filter(models.Tweet.content.ilike(f"%{query}%")).all()

def search_hashtags(db: Session, hashtag: str):
    hashtag_pattern = f"%#{hashtag}%"
    return db.query(models.Tweet).filter(models.Tweet.content.ilike(hashtag_pattern)).all()

def search_users(db: Session, username: str):
    return db.query(models.User).filter(models.User.username.ilike(f"%{username}%")).all()
