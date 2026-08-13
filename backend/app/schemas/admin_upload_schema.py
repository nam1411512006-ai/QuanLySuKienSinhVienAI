from pydantic import BaseModel


class UploadFileResponse(BaseModel):
    url: str
    ten_file: str
    kich_thuoc_kb: float
