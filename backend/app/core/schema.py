from typing import Optional, Literal, List
from pydantic import BaseModel, Field, EmailStr
from typing_extensions import  Annotated
from langgraph.graph.message import add_messages

class AgentState(BaseModel):
    user_id: str
    messages: Annotated[list, add_messages]

class ExtendedAgentState(AgentState):
    """Extended state for the agent with additional fields."""
    conversation_id: str = Field(..., description="ID de la conversación actual")

class RAGQueryInput(BaseModel):
    """Input schema for RAG (Retrieval-Augmented Generation) queries."""
    query: str = Field(..., description="Texto de consulta para buscar documentos relevantes")
    top_k: Optional[int] = Field(default=5, description="Número máximo de documentos a recuperar")
    collection: str = Field(..., description="Nombre de la colección de Qdrant para buscar documentos")

class RagSearchArgs(BaseModel):
    """Arguments for RAG search tool."""
    query: str
    collection: str
    top_k: int = 3

class PDFChunkerArgs(BaseModel):
    """Arguments for PDF chunking tool."""
    file_path: str = Field(..., description="Ruta del archivo PDF a procesar")
    max_pages: int = Field(default=15, description="Número máximo de páginas a procesar del PDF")
    max_tokens_per_chunk: int = Field(default=650, description="Número máximo de tokens por chunk")

class AddDocumentsArgs(BaseModel):
    """Arguments for adding documents to a collection."""
    collection_name: str = Field(..., description="Nombre de la colección en Qdrant")
    documents: List[str] = Field(..., description="Lista de documentos a agregar a la colección")

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)

class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"]
