# main.py
import uvicorn
from app.api.chat import app
from fastapi.middleware.cors import CORSMiddleware

import logging

logging.basicConfig(
    level=logging.INFO,  # Cambia a DEBUG si quieres más detalle
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
