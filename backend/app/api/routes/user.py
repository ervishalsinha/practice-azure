from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth import LoginRequest
from app.schemas.auth import Token
from app.schemas.user import UserCreate
from app.schemas.user import UserResponse
from app.services.auth_service import get_current_user
from app.services.auth_service import login_user
from app.services.user_service import create_user
from app.services.user_service import get_user_by_email
from app.models.user import User
from sqlalchemy import text
from app.db.database import engine

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    if get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return create_user(db, user)


@router.post(
    "/login",
    response_model=Token
)
def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db)
):
    token = login_user(
        db,
        login_request.email,
        login_request.password,
    )
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get(
    "/profile",
    response_model=UserResponse
)
def profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.get('/get_user')
def get_user(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users




@router.get("/db-test")
def db_test():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "Database connected"}
    except Exception as e:
        return {"error": str(e)}