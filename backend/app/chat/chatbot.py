import logging
from typing import Literal
from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from app.config.llm import llm_model
from app.tools.rag.search import rag_tool
from app.tools.rag.add_documents import add_documents_tool
from app.tools.rag.create_collection import create_collection_tool
from app.tools.rag.pdf_chunker import pdf_chunker_tool
from app.tools.rag.get_collections import get_collections_tool
from app.core.schema import AgentState

logger = logging.getLogger(__name__)


def initialize_agent_workflow():
    logger.info("Initializing agent workflow...")

    tools = [rag_tool, create_collection_tool, add_documents_tool, pdf_chunker_tool, get_collections_tool]
    model = llm_model.bind_tools(tools)
    tool_node = ToolNode(tools)

    def should_continue(state: AgentState) -> Literal["tools", END]:
        last_message = state["messages"][-1]
        return "tools" if last_message.tool_calls else END

    def call_model(state: AgentState):
        messages = state["messages"]
        return {"messages": [model.invoke(messages)]}

    workflow = StateGraph(AgentState)
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)
    workflow.add_edge(START, "agent")
    workflow.add_conditional_edges("agent", should_continue)
    workflow.add_edge("tools", "agent")

    checkpointer = MemorySaver()
    graph = workflow.compile(checkpointer=checkpointer)
    config = {"configurable": {"thread_id": 1}}

    logger.info("Agent workflow initialized.")
    return graph, config


def process_user_message(user_id: str, user_input: str, graph, config) -> str:
    inputs = {"messages": [("user", user_input)]}
    result = graph.invoke(inputs, config)
    print(result)  # Para depurar
    message = result["messages"][-1]
    return message.content
