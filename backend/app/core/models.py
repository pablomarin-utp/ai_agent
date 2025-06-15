from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.db import Base  
import uuid
from sqlalchemy.dialects.postgresql import UUID  # si usas PostgreSQL

class User(Base):
    
    """User model for the application."""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
