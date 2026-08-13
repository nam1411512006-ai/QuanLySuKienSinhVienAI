from fastapi import APIRouter, Depends, UploadFile, File

from app.core.dependencies import get_current_admin
from app.models.taikhoan import TaiKhoan
from app.schemas.admin_upload_schema import UploadFileResponse
from app.services import admin_upload_service

router = APIRouter(
    prefix="/admin/upload",
    tags=["Admin - Upload"],
)


@router.post("/anh", response_model=UploadFileResponse)
async def upload_anh(
    file: UploadFile = File(...),
    _admin: TaiKhoan = Depends(get_current_admin),
):
    return await admin_upload_service.upload_anh(file)
