from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from models import User
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from security.authSecurity import (
    get_current_user,
    create_access_token,
    get_db,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    pwd_context,
    verify_password,
)
from starlette.responses import Response
from datetime import timedelta

app = FastAPI()

origins = [
    "http://localhost:8001",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserCreateSchema(BaseModel):
    username: str
    password: str


def get_user_by_username_from_db(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user_in_db(db: Session, user: UserCreateSchema):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    return "complete"


@app.post("/register")
def register_user(user: UserCreateSchema, db: Session = Depends(get_db)):
    db_user = get_user_by_username_from_db(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    create_user_in_db(db=db, user=user)
    return {"message": "User registered successfully"}


def authenticate_user_from_db(username: str, password: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


@app.post("/token")
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends(),
                                 db: Session = Depends(get_db)):
    user = authenticate_user_from_db(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    response.set_cookie(key="access_token",
                        value=f"Bearer {access_token}",
                        httponly=True,
                        secure=False,
                        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                        samesite="lax")
    return {"message": "Logged in successfully"}


@app.get("/verify-token")
async def verify_user_token(current_user: User = Depends(get_current_user)):
    return {"message": "Token is valid", "username": current_user.username}


@app.get("/items")
async def read_items(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.username}! Here are some protected items.",
            "items": ["item1", "item2", "item3"]}


@app.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}
