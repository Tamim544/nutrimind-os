from fastapi import FastAPI, UploadFile, File, Form, Body, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import os
import json
from google import genai
from google.genai import types
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from functools import lru_cache

# Setup Gemini Client (Real API)
# Note: Using the key from your .env file
API_KEY = "AQ.Ab8RN6KFOZ71Z34Fru3FO_X8N3eK39p6_gp0G4q1k9lHvRuvhA"
client = genai.Client(api_key=API_KEY)

# Setup Rate Limiting for Security
limiter = Limiter(key_func=get_remote_address)

# Setup FastAPI
app = FastAPI(title="NutriMind OS - ADK Backend")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secure Security Headers
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

@app.get("/")
@limiter.limit("100/minute")
def read_root(request: Request):
    return {
        "status": "online",
        "service": "NutriMind OS ADK Agent Engine",
        "version": "v3"
    }

class UserContext(BaseModel):
    examMode: bool = False
    
class ChatMessage(BaseModel):
    role: str = Field(..., max_length=50)
    content: str = Field(..., max_length=2000)

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    history: List[ChatMessage]
    context: UserContext

# =====================================================================
# Google ADK (Agent Development Kit) Emulation Layer
# =====================================================================
# In a real Google ADK environment, these would inherit from adk.Agent.
# We are building the architecture as requested for Vertex AI deployment.

class ADKAgent:
    def __init__(self, name: str, model_name: str, role_description: str):
        self.name = name
        self.model_name = model_name # e.g. 'gemini-3-pro' or 'gemini-3-flash'
        self.role = role_description

    def _build_system_prompt(self, context: UserContext):
        prompt = f"You are the {self.name}. {self.role}\n"
        if context.examMode:
            prompt += "\n[EXAM MODE ACTIVE]: Prioritize cognitive focus, brain food, and sustained energy."
        return prompt

class VisionAgent(ADKAgent):
    def __init__(self):
        super().__init__("VisionAgent", "gemini-2.0-flash", "Analyze food images via native multimodal vision.")
        
    def analyze(self, image_data: bytes, context: UserContext):
        prompt = self._build_system_prompt(context) + "\nAnalyze this food image. Return a JSON object with: foods (list of name/portion), healthScore (0-100), calories, macros (protein, carbs, fat, fiber), warnings (list), positives (list), energyCrashRisk (low/med/high), fullnessDuration, and aiInsight (behavioral note)."
        
        response = client.models.generate_content(
            model=self.model_name,
            contents=[
                prompt,
                types.Part.from_bytes(data=image_data, mime_type="image/jpeg")
            ],
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)

class BehaviorAgent(ADKAgent):
    def __init__(self):
        super().__init__("BehaviorAgent", "gemini-2.0-pro-exp-02-05", "Analyze behavioral patterns and emotional eating.")

    def generate_twin(self, context: UserContext):
        prompt = self._build_system_prompt(context) + "\nGenerate a 'Digital Twin' health projection for the next 30 days based on emotional eating detection. Return JSON: currentStatus (energyLevel, sugarRisk, processedFoodScore, hydration, mealTiming - all 1-10), emotionalEatingScore (1-10), projections (list of day/event/severity), narrativeSummary."
        
        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)

class CoachAgent(ADKAgent):
    def __init__(self):
        super().__init__("CoachAgent", "gemini-2.0-pro-exp-02-05", "Conversational UI with session memory.")

    def chat(self, request: ChatRequest):
        prompt = self._build_system_prompt(request.context)
        history = []
        for msg in request.history:
            history.append(types.Content(role=msg.role, parts=[types.Part.from_text(text=msg.content)]))
            
        chat = client.chats.create(model=self.model_name, history=history)
        response = chat.send_message(request.message)
        return response.text

# =====================================================================
# NutriMind Orchestrator
# =====================================================================
class NutriMindOrchestrator:
    def __init__(self):
        self.vision_agent = VisionAgent()
        self.behavior_agent = BehaviorAgent()
        self.coach_agent = CoachAgent()
        print("Initializing ADK Orchestrator for Vertex AI Agent Engine...")

orchestrator = NutriMindOrchestrator()

# =====================================================================
# FastAPI Endpoints
# =====================================================================

@app.post("/api/scan")
async def scan_meal(
    file: UploadFile = File(...),
    examMode: bool = Form(False)
):
    """
    Handles VisionAgent multimodal requests.
    """
    contents = await file.read()
    context = UserContext(examMode=examMode)
    
    # A2A delegation: Orchestrator -> VisionAgent
    result = orchestrator.vision_agent.analyze(contents, context)
    return result

@app.post("/api/chat")
@limiter.limit("20/minute")
async def chat_with_coach(request: Request, req: ChatRequest):
    """
    Handles CoachAgent requests with session context.
    """
    # A2A delegation: Orchestrator -> CoachAgent
    response_text = orchestrator.coach_agent.chat(req)
    return {"response": response_text}

@app.post("/api/insights")
@limiter.limit("10/minute")
async def get_insights(request: Request, context: UserContext = Body(...)):
    """
    Handles BehaviorAgent Digital Twin generation.
    """
    # A2A delegation: Orchestrator -> BehaviorAgent
    result = orchestrator.behavior_agent.generate_twin(context)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
