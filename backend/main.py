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
API_KEY = "AQ." + "Ab8RN6I2xbBYMAG1XNePjfLKtqyYTvMWpqDsZ9C3C-GJcn1SDg"
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
        super().__init__("VisionAgent", "gemini-flash-latest", "Analyze food images via native multimodal vision.")
        
    def analyze(self, image_data: bytes, context: UserContext):
        prompt = self._build_system_prompt(context) + "\nAnalyze this food image. Return a JSON object with: foods (list of name/portion), healthScore (0-100), calories, macros (protein, carbs, fat, fiber), warnings (list), positives (list), energyCrashRisk (low/med/high), fullnessDuration, and aiInsight (behavioral note)."
        
        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=[
                    prompt,
                    types.Part.from_bytes(data=image_data, mime_type="image/jpeg")
                ],
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Vision API Error: {e}")
            import random
            score = 55 if context.examMode else 62
            return {
                "foods": [{"name": "Detected Meal (Mock Fallback)", "portion": "1 serving"}],
                "healthScore": score,
                "calories": random.randint(400, 700),
                "macros": {"protein": 25, "carbs": 60, "fat": 20, "fiber": 5},
                "warnings": ["Potential energy crash in 2 hours." if context.examMode else "Moderate sodium."],
                "positives": ["Good protein content."],
                "energyCrashRisk": "high" if context.examMode else "moderate",
                "fullnessDuration": "3 hours",
                "aiInsight": "VisionAgent delegated to NutritionAgent via A2A. (Note: Using Mock Data because your API key is invalid)."
            }

class BehaviorAgent(ADKAgent):
    def __init__(self):
        super().__init__("BehaviorAgent", "gemini-pro-latest", "Analyze behavioral patterns and emotional eating.")

    def generate_twin(self, context: UserContext):
        prompt = self._build_system_prompt(context) + "\nGenerate a 'Digital Twin' health projection for the next 30 days based on emotional eating detection. Return JSON: currentStatus (energyLevel, sugarRisk, processedFoodScore, hydration, mealTiming - all 1-10), emotionalEatingScore (1-10), projections (list of day/event/severity), narrativeSummary."
        
        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Behavior API Error: {e}")
            return {
                "currentStatus": {
                    "energyLevel": 5 if context.examMode else 6,
                    "sugarRisk": 7,
                    "processedFoodScore": 5,
                    "hydration": 4 if context.examMode else 6,
                    "mealTiming": 6
                },
                "emotionalEatingScore": 8.5,
                "projections": [
                    {"day": 7, "event": "High risk of late-night stress eating during study sessions.", "severity": "high" if context.examMode else "medium"}
                ],
                "narrativeSummary": "BehaviorAgent detected elevated stress markers. Your late-night snacking increased 22%. Tool confirmation (HITL) recommends an intervention. (Note: Using Mock Data because your API key is invalid)."
            }

class CoachAgent(ADKAgent):
    def __init__(self):
        super().__init__("CoachAgent", "gemini-pro-latest", "Conversational UI with session memory.")

    def chat(self, request: ChatRequest):
        prompt = self._build_system_prompt(request.context)
        history = []
        for msg in request.history:
            history.append(types.Content(role=msg.role, parts=[types.Part.from_text(text=msg.content)]))
            
        try:
            chat = client.chats.create(model=self.model_name, history=history)
            response = chat.send_message(request.message)
            return response.text
        except Exception as e:
            print(f"Coach API Error: {e}")
            msg = request.message.lower()
            if "rewind" in msg:
                return "⏪ **ADK Session Rewind Active:** I have rewound your state to before you ate the biryani. Your projected energy crash has been cleared. What would you like to eat instead? *(Mock Mode)*"
            elif request.context.examMode:
                return "📚 **Exam Mode (Gemini 3 Pro):** I recommend high-omega-3 foods right now to maintain cognitive load. Avoid heavy carbs. *(Mock Mode)*"
            else:
                return f"**NutritionAgent via CoachAgent:** Received your query about '{request.message}'. I've analyzed your recent BehaviorAgent logs and suggest a balanced protein meal. *(Mock Mode - Fix API Key)*"

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
