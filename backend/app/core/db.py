from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import engine


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
