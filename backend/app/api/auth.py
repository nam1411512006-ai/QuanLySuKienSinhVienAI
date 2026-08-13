from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth_schema import LoginRequest, LoginResponse
from app.services.auth_service import login


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse, summary="Dang nhap")
def login_api(data: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    return login(db, data)