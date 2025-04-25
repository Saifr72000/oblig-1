from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True

class TweetCreate(BaseModel):
    content: str

class TweetResponse(BaseModel):
    id: int
    content: str
    timestamp: datetime
    author_id: int

    class Config:
        orm_mode = True