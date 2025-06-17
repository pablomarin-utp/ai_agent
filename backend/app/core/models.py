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

class Message(Base):
    
    """Message model for storing chat messages."""

    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    conversation_id = Column(UUID(as_uuid=True), nullable=False)
    sender = Column(String, nullable=False)  # Puede ser 'user' o 'agent'
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    

class Conversation(Base):

    """Conversation model for storing chat conversations."""

    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())