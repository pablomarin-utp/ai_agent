from app.core.schema import RegisterRequest, LoginRequest
import bcrypt, logging
from app.core.models import User  # Tu modelo SQL/ORM
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.core.jwt import create_access_token  # Asegúrate de tener esta función definida
logger = logging.getLogger(__name__)

async def register_user(data: RegisterRequest, db: Session) -> dict:

    """Register a new user in the system."""

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        logger.warning(f"Register attempt failed (duplicate email): {data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The email is already registered."
        )

    hashed_pw = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt())

    new_user = User(
        email=data.email,
        hashed_password=hashed_pw.decode(),
        is_active=False, #i gotta accept them manually
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info(f"User registered successfully: {new_user.email}")
    return {"msg": "User registered successfully. Pending activation."}

async def login_user(data: LoginRequest, db: Session) -> dict:

    """Authenticate a user and returns a JWT token."""

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        logger.warning(f"Login attempt failed: {data.email}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

    if not bcrypt.checkpw(data.password.encode(), user.hashed_password.encode()):
        logger.warning(f"Login attempt failed: {data.email}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

    # Generar el JWT
    access_token = create_access_token(data={"email": user.email, 
                                             "id": str(user.id), 
                                             "is_active": user.is_active, 
                                             "is_admin": user.is_admin
                                             })

    logger.info(f"User authenticated successfully: {user.email}")
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str) -> dict:
    
    """
    Get the currently logged-in user.
    This is a placeholder function and should be replaced with actual user retrieval logic.
    """
    pass