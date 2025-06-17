from typing import List, Dict, Optional
import google.generativeai as genai
from app.core.config import settings
import json

class Chatbot:
    def __init__(self):
        self.conversations = {}
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        self.system_prompt = """You are an expert drone flight analyst assistant. Your role is to help users understand their flight logs by analyzing MAVLink telemetry data.
        You have access to flight data including:
        - Flight statistics (altitude, battery, etc.)
        - Events and errors
        - GPS data
        - Mode changes
        
        When answering questions:
        1. Be precise and technical but explain in clear terms
        2. If you're unsure about something, ask for clarification
        3. Use the available data to support your answers
        4. If you detect anomalies, explain them clearly
        5. Maintain context from previous questions in the conversation
        
        You can use these functions to access flight data:
        - get_max_altitude(): Returns the maximum altitude reached
        - get_flight_time(): Returns total flight duration
        - get_gps_issues(): Returns list of GPS signal issues
        - get_critical_errors(): Returns list of critical errors
        - get_mode_changes(): Returns list of flight mode changes"""
        
    def _get_conversation_history(self, conversation_id: str) -> List[Dict]:
        """Get conversation history for a specific ID."""
        return self.conversations.get(conversation_id, [])
    
    def _update_conversation_history(self, conversation_id: str, messages: List[Dict]):
        """Update conversation history for a specific ID."""
        self.conversations[conversation_id] = messages
    
    def process_message(self, message: str, conversation_id: str, flight_data: Dict) -> str:
        messages = self._get_conversation_history(conversation_id)
        if not messages:
            messages.append({
                "role": "system",
                "content": self.system_prompt
            })
        messages.append({
            "role": "user",
            "content": message
        })
        # Compose the prompt for Gemini
        prompt = self.system_prompt + "\n" + json.dumps(flight_data) + "\n" + message
        try:
            response = self.model.generate_content(prompt)
            answer = response.text
            messages.append({
                "role": "assistant",
                "content": answer
            })
            self._update_conversation_history(conversation_id, messages)
            return answer
        except Exception as e:
            return f"Error processing message: {str(e)}"
    
    def clear_conversation(self, conversation_id: str):
        """Clear conversation history for a specific ID."""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id] 