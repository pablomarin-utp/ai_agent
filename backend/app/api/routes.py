from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
router = APIRouter()
router.include_router(auth_router, prefix="/auth", tags=["Auth"])
router.include_router(chat_router, tags=["Chat"])