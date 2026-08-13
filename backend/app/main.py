from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.router import api_router

from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API cho nen tang quan ly su kien sinh vien tich hop AI.",
    version="0.1.0",
    debug=settings.debug,
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# UPLOADS
# =====================================================

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# =====================================================
# ROUTERS
# =====================================================

app.include_router(api_router)


# =====================================================
# ROOT
# =====================================================

@app.get("/", tags=["Root"])
def root() -> dict[str, str]:
    return {
        "message": "QuanLySuKienSinhVienAI API",
        "docs": "/docs",
    }


