# app/routers/tweets.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import SessionLocal

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------
# Create a new tweet
# -------------------------------
@router.post("/", response_model=schemas.TweetResponse)
def create_tweet(tweet: schemas.TweetCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_tweet(db=db, tweet=tweet, user_id=user_id)

# -------------------------------
# Get all tweets
# -------------------------------
@router.get("/", response_model=list[schemas.TweetResponse])
def list_tweets(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_tweets(db=db, skip=skip, limit=limit)

# -------------------------------
# Update a tweet
# -------------------------------
@router.put("/{tweet_id}", response_model=schemas.TweetResponse)
def update_tweet(tweet_id: int, content: str, db: Session = Depends(get_db)):
    updated_tweet = crud.update_tweet(db=db, tweet_id=tweet_id, content=content)
    if not updated_tweet:
        raise HTTPException(status_code=404, detail="Tweet not found")
    return updated_tweet

# -------------------------------
# Delete a tweet
# -------------------------------
@router.delete("/{tweet_id}", response_model=schemas.TweetResponse)
def delete_tweet(tweet_id: int, db: Session = Depends(get_db)):
    deleted_tweet = crud.delete_tweet(db=db, tweet_id=tweet_id)
    if not deleted_tweet:
        raise HTTPException(status_code=404, detail="Tweet not found")
    return deleted_tweet


# -------------------------------
# Search a tweet
# -------------------------------
@router.get("/search/", response_model=list[schemas.TweetResponse])
def search_tweets(query: str, db: Session = Depends(get_db)):
    tweets = crud.search_tweets(db=db, query=query)
    return tweets


# -------------------------------
# Search a hashtag
# -------------------------------
@router.get("/hashtags/", response_model=list[schemas.TweetResponse])
def search_hashtags(hashtag: str, db: Session = Depends(get_db)):
    tweets = crud.search_hashtags(db=db, hashtag=hashtag)
    return tweets
