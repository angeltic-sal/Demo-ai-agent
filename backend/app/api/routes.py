from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Optional
import os
import uuid
from app.services.log_parser import LogParser
from app.services.chatbot import Chatbot
from app.core.config import settings

router = APIRouter()
chatbot = Chatbot()

# Store flight data in memory (in production, use a proper database)
flight_data_store: Dict[str, Dict] = {}

@router.post("/upload")
async def upload_log(file: UploadFile = File(...)) -> Dict:
    """Upload and parse a MAVLink log file."""
    if not file.filename.endswith('.bin'):
        raise HTTPException(status_code=400, detail="Only .bin files are supported")
    
    # Generate unique ID for this log
    log_id = str(uuid.uuid4())
    
    # Save file temporarily
    file_path = os.path.join(settings.UPLOAD_DIR, f"{log_id}.bin")
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Parse the log file
        parser = LogParser(file_path)
        flight_data = parser.parse()
        
        # Store the parsed data
        flight_data_store[log_id] = flight_data
        
        # Clean up the temporary file
        os.remove(file_path)
        
        return {
            "log_id": log_id,
            "message": "Log file uploaded and parsed successfully",
            "summary": flight_data
        }
        
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/{log_id}")
async def chat(
    log_id: str,
    message: Dict[str, str],
    conversation_id: Optional[str] = None
) -> Dict:
    """Process a chat message and return a response."""
    if log_id not in flight_data_store:
        raise HTTPException(status_code=404, detail="Log file not found")
    
    if not conversation_id:
        conversation_id = str(uuid.uuid4())
    
    try:
        response = chatbot.process_message(
            message["message"],
            conversation_id,
            flight_data_store[log_id]
        )
        
        return {
            "conversation_id": conversation_id,
            "response": response
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/chat/{log_id}")
async def clear_chat(log_id: str, conversation_id: str) -> Dict:
    """Clear chat history for a specific conversation."""
    if log_id not in flight_data_store:
        raise HTTPException(status_code=404, detail="Log file not found")
    
    chatbot.clear_conversation(conversation_id)
    return {"message": "Chat history cleared successfully"} 