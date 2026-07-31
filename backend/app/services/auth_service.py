from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from sqlalchemy.orm import Session

from app.core.jwt import oauth2_scheme
from app.core.jwt import verify_access_token
from app.db.database import get_db
from app.models.user import User
from app.services.user_service import get_user_by_email
from app.core.security import verify_password


def login_user(
    db: Session,
    email: str,
    password: str
):

    user = get_user_by_email(db, email)

    if not user:
        return None

    if not verify_password(
        password,
        user.password
    ):
        return None

    from app.core.jwt import create_access_token

    token = create_access_token(
        {
            "sub": user.email,
            "id": user.id
        }
    )

    return token


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = verify_access_token(token)
    email = payload.get("sub")
    if email is None:
        raise credentials_exception

    user = get_user_by_email(db, email)
    if not user:
        raise credentials_exception

    return user