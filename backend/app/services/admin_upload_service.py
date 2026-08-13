import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.schemas.admin_upload_schema import UploadFileResponse

# Thu muc uploads/ nam o goc backend, da duoc mount vao StaticFiles trong main.py
# (xem app.mount("/uploads", StaticFiles(directory="uploads"), ...))
THU_MUC_UPLOAD = Path("uploads")

DUOI_FILE_ANH_HOP_LE = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
KICH_THUOC_TOI_DA_MB = 10


async def upload_anh(file: UploadFile) -> UploadFileResponse:

    duoi_file = Path(file.filename or "").suffix.lower()

    if duoi_file not in DUOI_FILE_ANH_HOP_LE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Chi chap nhan file anh dinh dang: {', '.join(sorted(DUOI_FILE_ANH_HOP_LE))}",
        )

    noi_dung = await file.read()
    kich_thuoc_mb = len(noi_dung) / (1024 * 1024)

    if kich_thuoc_mb > KICH_THUOC_TOI_DA_MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File vuot qua gioi han {KICH_THUOC_TOI_DA_MB}MB.",
        )

    THU_MUC_UPLOAD.mkdir(parents=True, exist_ok=True)

    ten_file_moi = f"{uuid.uuid4().hex}{duoi_file}"
    duong_dan = THU_MUC_UPLOAD / ten_file_moi

    with open(duong_dan, "wb") as f:
        f.write(noi_dung)

    return UploadFileResponse(
        url=ten_file_moi,
        ten_file=file.filename or ten_file_moi,
        kich_thuoc_kb=round(len(noi_dung) / 1024, 1),
    )
