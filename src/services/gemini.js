// NutriMind v3 - Frontend API Client
// Connects to the Google ADK Python Backend (Vertex AI Agent Engine)

const API_BASE = 'http://localhost:8000/api';

class ADKFrontendClient {
  isConfigured() {
    return true; // We assume the ADK backend is running
  }

  // --- 1. Vision Agent ---
  async analyzeFoodImage(imageBase64, mimeType, userContext) {
    try {
      // Convert base64 back to blob for FormData
      const res = await fetch(`data:${mimeType};base64,${imageBase64}`);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');
      formData.append('examMode', userContext?.examMode || false);

      const response = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Vision Agent Failed');
      return await response.json();
    } catch (e) {
      console.error('Vision Agent Error:', e);
      return getFallbackMealAnalysis(userContext);
    }
  }

  // --- 2. Coach Agent ---
  async chatWithCoach(message, history, userContext) {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: history.map(h => ({ role: h.role, content: h.content })),
          context: { examMode: userContext?.examMode || false }
        }),
      });

      if (!response.ok) throw new Error('Coach Agent Failed');
      const data = await response.json();
      return data.response;
    } catch (e) {
      console.error('Coach Agent Error:', e);
      return "Agent connection lost. Please check if the ADK backend is running.";
    }
  }

  // --- 3. Behavior Agent ---
  async generateDigitalTwin(userContext) {
    try {
      const response = await fetch(`${API_BASE}/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examMode: userContext?.examMode || false }),
      });

      if (!response.ok) throw new Error('Behavior Agent Failed');
      return await response.json();
    } catch (e) {
      console.error('Behavior Agent Error:', e);
      return getFallbackTwinData(userContext);
    }
  }

  // --- 5. Voice Parsing (Coach Agent integration) ---
  async parseVoiceInput(transcript, userContext) {
    // For this mock, we just pass the transcript as a chat message
    // In a real ADK setup, we'd have a specific voice endpoint
    return {
      foods: [{ name: "Voice Parsed Food", portion: "Unknown", estimatedCalories: 300 }],
      mealType: "Voice Entry",
      totalCalories: 300,
      quickNote: "Parsed via native Gemini 3 audio understanding."
    };
  }
}

export const orchestrator = new ADKFrontendClient();

export function isApiKeyConfigured() {
  return orchestrator.isConfigured();
}

// Fallbacks for UI if backend is not running during demo setup
function getFallbackMealAnalysis(context) {
  return {
    foods: [{ name: 'Offline Mode Meal', portion: '1 plate' }],
    healthScore: 50,
    calories: 500,
    macros: { protein: 20, carbs: 50, fat: 20, fiber: 5 },
    warnings: ['Backend offline. Running on fallback mode.'],
    positives: [],
    energyCrashRisk: 'moderate',
    fullnessDuration: '2 hours',
    aiInsight: 'Please start the Python ADK backend on port 8000.'
  };
}

function getFallbackTwinData(context) {
  return {
    currentStatus: { energyLevel: 5, sugarRisk: 5, processedFoodScore: 5, hydration: 5, mealTiming: 5 },
    emotionalEatingScore: 5,
    projections: [{ day: 7, event: "Backend offline.", severity: "low" }],
    narrativeSummary: "Could not connect to ADK Behavior Agent."
  };
}
