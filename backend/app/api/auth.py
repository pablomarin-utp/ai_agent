from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from core.auth import register_user, login_user, get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.schema import RegisterRequest
from app.core.auth import register_user
from app.core.db import get_db

router = APIRouter()

@router.post("/register")
async def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return await register_user(data, db)

@router.post("/login")
async def login(data: RegisterRequest, db: Session = Depends(get_db)):
    return await login_user(data, db)
