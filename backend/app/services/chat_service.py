from typing import Dict, List, Optional
import google.generativeai as genai
from app.core.config import settings
import json

class ChatService:
    def __init__(self, api_key: str = None, model: str = None):
        genai.configure(api_key=api_key or settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(model or settings.GEMINI_MODEL)
        self.conversations: Dict[str, List[Dict]] = {}
        
    def process_message(self, log_id: str, message: str, log_summary: Dict) -> str:
        """Process a user message and generate a response."""
        try:
            # Get or create conversation history
            if log_id not in self.conversations:
                self.conversations[log_id] = []
                
            # Add system message with log summary
            if not self.conversations[log_id]:
                self.conversations[log_id].append({
                    "role": "system",
                    "content": f"You are a helpful assistant analyzing UAV flight logs. Here is the summary of the current log:\n{json.dumps(log_summary, indent=2)}"
                })
            
            # Add user message
            self.conversations[log_id].append({
                "role": "user",
                "content": message
            })
            
            # Compose the prompt for Gemini
            prompt = self.conversations[log_id][0]["content"] + "\n" + message
            response = self.model.generate_content(prompt)
            assistant_message = response.text
            self.conversations[log_id].append({
                "role": "assistant",
                "content": assistant_message
            })
            
            return assistant_message
            
        except Exception as e:
            return f"Error processing message: {str(e)}"
    
    def clear_conversation(self, log_id: str) -> bool:
        """Clear the conversation history for a specific log."""
        if log_id in self.conversations:
            del self.conversations[log_id]
            return True
        return False 