# app/routers/users.py

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
# Create a new user
# -------------------------------
@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# -------------------------------
# List all users
# -------------------------------
@router.get("/", response_model=list[schemas.UserResponse])
def list_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

# -------------------------------
# Search users
# -------------------------------
@router.get("/search/", response_model=list[schemas.UserResponse])
def search_users(username: str, db: Session = Depends(get_db)):
    users = crud.search_users(db=db, username=username)
    return users
