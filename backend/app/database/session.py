from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import get_settings

settings = get_settings()

connect_args = {}

# ==================== DATABASE SSL ====================
# Chi bat SSL khi DATABASE_SSL_ENABLED=true.
if settings.database_ssl_enabled:
    ca_path = Path(__file__).resolve().parents[3] / "certs" / "ca.pem"

    connect_args = {
        "ssl": {
            "ca": str(ca_path),
        }
    }

# ==================== SQLALCHEMY ENGINE ====================
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    connect_args=connect_args,
)

# ==================== SESSION ====================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


# ==================== DATABASE DEPENDENCY ====================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()