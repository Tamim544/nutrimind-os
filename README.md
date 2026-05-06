# NutriMind OS 🧠

> **We are not tracking food. We are understanding human eating behavior using AI.**

NutriMind OS is a **Predictive Behavioral Nutrition Operating System**. Instead of acting as a passive calorie counter, it utilizes a sophisticated **Multi-Agent AI Architecture** powered by Google Gemini to predict *why* users eat poorly and prevent unhealthy choices before they happen.

Built for the **AMD Slingshot Hackathon 2025**.

![NutriMind OS UI Screenshot](https://raw.githubusercontent.com/tamimchowdhury/nutrimind-ai/main/docs/ui-preview.png) *(Note: Add screenshot to docs folder)*

## 🏆 Key Differentiators

*   **Multi-Agent Architecture**: Inputs are orchestrated to 5 specialized Gemini AI agents (Vision, Nutrition, Behavior, Recommendation, Grocery).
*   **Predictive Craving Engine**: Anticipates sugar cravings or stress eating based on time-of-day and behavioral logs.
*   **Smart Exam Mode**: A campus-focused feature that shifts AI logic to prioritize cognitive performance, brain food, and sustained energy during finals week.
*   **Digital Twin Projection**: Simulates a 30-day health consequence narrative based on current emotional eating patterns.

## 🔷 Google AI Stack

This project deeply integrates **8 distinct Google Services**:

1.  **Gemini API**: Central reasoning engine powering the Multi-Agent Architecture.
2.  **Firebase**: Firestore (context storage), Cloud Functions (orchestrator), Auth, and Analytics.
3.  **ML Kit**: On-device, offline-capable image labeling and barcode scanning.
4.  **Google Maps API**: Context-aware restaurant recommendations based on health goals.
5.  **Google Fit API**: Sleep and activity data fed into the Context Engine.
6.  **Speech-to-Text API**: Frictionless voice nutrition logging for high accessibility.
7.  **Vertex AI**: Enterprise-scale deployment layer.
8.  **Firebase Analytics**: Detects stress usage patterns to feed the Behavior Agent.

## 🚀 13 Core Features

1.  AI Camera Meal Scanner
2.  Predictive Craving Engine
3.  Nutrition Agent (AI-first UI)
4.  Digital Twin Consequence Simulator
5.  **Smart Exam Mode**
6.  **Emotional Eating Detection**
7.  Voice Nutrition Logging
8.  AI Grocery Scanner
9.  Smart Restaurant Finder
10. Health Storytelling Dashboard
11. AI Habit Score
12. South Asian Food Intelligence
13. Offline ML Emergency Mode

## 🏗️ System Flow

1.  **User Input**: Voice, Camera, Text, or Sensor data (Fit API).
2.  **Agent Orchestrator**: Routes input to the correct specialized Gemini Agent.
3.  **Context Engine**: Enriches the prompt with active states (e.g., Exam Mode, Sleep debt).
4.  **Gemini Reasoning Layer**: Generates highly specialized, structured JSON insights.
5.  **Behavior Engine**: Learns async from user patterns via Firebase Analytics.
6.  **Personalized Output**: Delivers contextual coaching and UI updates.

## 💻 Tech Stack

*   **Frontend**: React + Vite + Vanilla CSS
*   **Styling**: Premium Dark Mode, Glassmorphism, Micro-animations
*   **AI SDK**: `@google/generative-ai`
*   **Deployment Target**: Firebase Hosting

## 🛠️ Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nutrimind-ai.git
   cd nutrimind-ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 License
MIT License
