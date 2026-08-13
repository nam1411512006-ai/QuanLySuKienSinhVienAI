from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database.session import get_db
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_dashboard_schema import DashboardResponse
from app.services import admin_dashboard_service

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin - Dashboard"],
)


@router.get("", response_model=DashboardResponse)
def lay_dashboard(
    db: Session = Depends(get_db),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return admin_dashboard_service.lay_du_lieu_dashboard(db=db)
