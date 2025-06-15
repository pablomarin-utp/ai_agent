from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.chat.chatbot import initialize_agent_workflow, process_user_message

app = FastAPI()

graph, config = initialize_agent_workflow()


class ChatInput(BaseModel):
    user_id: str
    message: str


@app.post("/chat")
def chat(input_data: ChatInput):
    try:
        response = process_user_message(input_data.user_id, input_data.message, graph, config)
        print(f"Response for user {input_data.user_id}: {response}")
        return {"response": response}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
