from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.admin_caidat_schema import CaiDatHeThongResponse
from app.services import admin_caidat_service

router = APIRouter(
    prefix="/cai-dat",
    tags=["Public - Cai dat"],
)


@router.get("/cong-khai", response_model=CaiDatHeThongResponse)
def lay_cai_dat_cong_khai(db: Session = Depends(get_db)):
    """
    Endpoint cong khai, KHONG yeu cau dang nhap, dung de hien thi logo/ten
    truong tren cac man hinh dung chung (dang nhap, sidebar, header...).
    """
    return admin_caidat_service.lay_cai_dat(db=db)
