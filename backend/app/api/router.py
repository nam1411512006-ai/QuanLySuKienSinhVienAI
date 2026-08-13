from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.health import router as health_router
from app.api.sukien import router as sukien_router
from app.api import dangky
from app.api.danhgia import router as danhgia_router
from app.api.taikhoan import router as taikhoan_router
from app.api.thongbao import router as thongbao_router
from app.api.organizer import router as organizer_router
from app.api.diemdanh import router as diemdanh_router
from app.api.admin_taikhoan import router as admin_taikhoan_router
from app.api.admin_danhmuc import router as admin_danhmuc_router
from app.api.admin_sukien import router as admin_sukien_router
from app.api.admin_bantochuc import router as admin_bantochuc_router
from app.api.admin_sinhvien import router as admin_sinhvien_router
from app.api.admin_thongbao import router as admin_thongbao_router
from app.api.admin_vaitro import router as admin_vaitro_router
from app.api.admin_baocao import router as admin_baocao_router
from app.api.admin_caidat import router as admin_caidat_router
from app.api.admin_upload import router as admin_upload_router
from app.api.caidat_congkhai import router as caidat_congkhai_router
from app.api.admin_dashboard import router as admin_dashboard_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(sukien_router)
api_router.include_router(dangky.router)
api_router.include_router(danhgia_router)
api_router.include_router(taikhoan_router)
api_router.include_router(thongbao_router)
api_router.include_router(organizer_router)
api_router.include_router(diemdanh_router)
api_router.include_router(admin_taikhoan_router)
api_router.include_router(admin_danhmuc_router)
api_router.include_router(admin_sukien_router)
api_router.include_router(admin_bantochuc_router)
api_router.include_router(admin_sinhvien_router)
api_router.include_router(admin_thongbao_router)
api_router.include_router(admin_vaitro_router)
api_router.include_router(admin_baocao_router)
api_router.include_router(admin_caidat_router)
api_router.include_router(admin_upload_router)
api_router.include_router(caidat_congkhai_router)
api_router.include_router(admin_dashboard_router)