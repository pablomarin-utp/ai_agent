from fastapi import HTTPException
from app.chat.chatbot import initialize_agent_workflow, process_user_message
from fastapi import APIRouter
import logging
from app.core.schema import AgentState

logger = logging.getLogger(__name__)
router = APIRouter()

graph, config = initialize_agent_workflow()


@router.post("/chat")
def chat(input_data: AgentState) -> dict:
    """
    Endpoint to handle user messages and return responses from the agent.
    """
    logger.info("Received chat request")
    logger.debug(f"Input data: {input_data}")
    logger.debug(f"Received message from user {input_data.user_id}: {input_data.messages}")
    try:
        logger.debug(f"Processing message: {input_data.messages}")
        response = process_user_message(input_data.user_id, input_data.messages, graph, config)
        logger.info(f"Response for user {input_data.user_id}: {response}")
        return {"response": response}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
