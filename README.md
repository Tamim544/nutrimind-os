# NutriMind OS v3 🧠

> **We are not tracking food. We are understanding human eating behavior using Google ADK.**

NutriMind OS is a **Predictive Behavioral Nutrition Operating System** built specifically for the **Build with AI 2026 Hackathon**. We have moved beyond generic API calls to build a true multi-agent system using the **Google Agent Development Kit (ADK)** deployed on **Vertex AI Agent Engine**.

## 🚀 The ADK Architecture

Our backend is powered by a Python-based ADK pipeline orchestrating 5 specialized agents via **A2A (Agent-to-Agent) Protocol**:

*   **NutriMindOrchestrator** (RootAgent): Routes requests and maintains session state.
*   **VisionAgent** (Gemini 3 Flash): Uses native multimodal capabilities to analyze live food streams. Delegates data to NutritionAgent.
*   **NutritionAgent** (Gemini 3 Pro): Uses **Vertex AI Code Execution Sandbox** to compute precise diet math instead of hardcoded formulas.
*   **BehaviorAgent** (Gemini 3 Pro): Uses **Managed MCP** to pull Google Fit data and detect emotional eating patterns. 
*   **CoachAgent** (Gemini 3 Pro): Native audio understanding and utilizes **ADK Session Rewind** for "diet experiments".

## 🔷 Ultimate Google Tech Stack

We heavily utilize the modern 2026 Google ecosystem:

1.  **Google ADK (Agent Development Kit)**: Core Python framework.
2.  **Gemini 3 Pro & Flash**: Reasoning and multimodal agents.
3.  **Vertex AI Agent Engine Runtime**: Serverless deployment target for our ADK pipeline.
4.  **Google Managed MCP Servers**: Pre-built connections to Firestore and Google Fit without custom code.
5.  **Antigravity IDE**: The entire application was built using agentic vibe coding.

## 🌟 Wow-Factor Features

*   **ADK Session Rewind**: "Rewind my nutrition to before I drank the soda."
*   **HITL (Human-in-the-loop) Tool Confirmation**: The AI pauses and asks permission before logging severe stress eating events to your health record.
*   **Gemini 3 Live Food Stream**: Real-time video analysis of your plate.
*   **Code Execution Sandbox**: Dynamic calorie computation.
*   **Google Agentspace Integration**: B2B scalability.

## 💻 Tech Stack

*   **Backend**: Python, Google ADK, FastAPI
*   **Frontend**: React + Vite (Flutter alternative)
*   **Deployment**: Vertex AI Agent Engine + Firebase Hosting

## 🛠️ Local Setup

### 1. Run the ADK Backend (Python)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py
```
*(Runs on `http://localhost:8000`)*

### 2. Run the Frontend (React)
```bash
npm install
npm run dev
```
*(Runs on `http://localhost:5180`)*

## 📜 License
MIT License
