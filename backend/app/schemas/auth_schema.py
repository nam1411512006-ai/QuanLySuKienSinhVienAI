from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserResponse(BaseModel):
    ma_tai_khoan: int
    ho_ten: str
    email: str | None
    ma_vai_tro: int
    ten_vai_tro: str
    mssv: str | None = None
    anh_dai_dien: str | None = None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse