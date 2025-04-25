from fastapi import FastAPI
from app.routers import tweets, users
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tweets.router, prefix="/tweets", tags=["Tweets"])
app.include_router(users.router, prefix="/users", tags=["Users"])

@app.get("/")
def read_root():
    return {"message": "Twitter Clone API is running"}