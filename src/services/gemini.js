import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

class AgentOrchestrator {
  constructor() {
    this.genAI = null;
    this.models = {};
    if (API_KEY) {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      // Enterprise architecture: distinct models could be configured differently
      this.models = {
        vision: this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }),
        text: this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      };
    }
  }

  isConfigured() {
    return !!this.genAI;
  }

  // --- Context Engine ---
  buildContext(userContext) {
    let contextStr = `\n[System Context - User Profile]:
- Activity: Moderate (6k steps avg)
- Sleep: 6-7 hours
- Exam Mode Active: ${userContext?.examMode ? 'YES' : 'NO'}`;
    
    if (userContext?.examMode) {
      contextStr += `\n[EXAM MODE RULES]: Focus heavily on cognitive performance, brain food (omega-3s, antioxidants), sustained energy (low GI carbs), and sleep quality. Avoid foods that cause drowsiness or sugar crashes.`;
    }
    return contextStr;
  }

  // --- 1. Vision Agent ---
  async analyzeFoodImage(imageBase64, mimeType, userContext) {
    if (!this.isConfigured()) return getFallbackMealAnalysis(userContext);

    const prompt = `You are the NutriMind Vision Agent. Analyze this meal image and return ONLY a raw JSON response:
{
  "foods": [{"name": "food", "portion": "amount"}],
  "healthScore": 0-100,
  "calories": 450,
  "macros": {"protein": 25, "carbs": 55, "fat": 18, "fiber": 6},
  "warnings": ["warning"],
  "positives": ["positive"],
  "energyCrashRisk": "low|moderate|high",
  "fullnessDuration": "2-3 hours",
  "aiInsight": "Behavioral insight about this meal"
}
${this.buildContext(userContext)}`;

    try {
      const result = await this.models.vision.generateContent([
        prompt, { inlineData: { mimeType, data: imageBase64 } }
      ]);
      return JSON.parse(result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch (e) {
      console.error('Vision Agent Error:', e);
      return getFallbackMealAnalysis(userContext);
    }
  }

  // --- 2. Nutrition Agent (Conversational Coach) ---
  async chatWithCoach(message, history, userContext) {
    if (!this.isConfigured()) return getFallbackCoachResponse(message, userContext);

    const systemPrompt = `You are the NutriMind Nutrition Agent — a behavioral nutrition OS, not a calorie counter.
You understand WHY users eat the way they do and help prevent unhealthy choices before they happen.
Respond in a warm, science-backed, and proactive way. Keep it concise.
${this.buildContext(userContext)}`;

    try {
      const chat = this.models.text.startChat({
        history: [
          { role: 'user', parts: [{ text: 'Initialize Nutrition Agent.' }] },
          { role: 'model', parts: [{ text: systemPrompt }] },
          ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }))
        ]
      });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (e) {
      console.error('Nutrition Agent Error:', e);
      return getFallbackCoachResponse(message, userContext);
    }
  }

  // --- 3. Behavior Agent (Digital Twin & Emotional Eating) ---
  async generateDigitalTwin(userContext) {
    if (!this.isConfigured()) return getFallbackTwinData(userContext);

    const prompt = `You are the NutriMind Behavior Agent. You build Digital Twins to simulate health outcomes.
Generate a 30-day narrative storytelling projection based on current habits.
Return ONLY raw JSON:
{
  "currentStatus": { "energyLevel": 6, "sugarRisk": 7, "processedFoodScore": 5, "hydration": 5, "mealTiming": 6 },
  "emotionalEatingScore": 8,
  "projections": [
    {"day": 7, "event": "description", "severity": "low|medium|high"}
  ],
  "narrativeSummary": "A human, compelling 3-sentence story about their week's behavior (e.g., 'Your late-night snacking reduced...')"
}
${this.buildContext(userContext)}`;

    try {
      const result = await this.models.text.generateContent(prompt);
      return JSON.parse(result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch (e) {
      console.error('Behavior Agent Error:', e);
      return getFallbackTwinData(userContext);
    }
  }

  // --- 4. Recommendation Agent (Maps Context - Mocked via Text for now) ---
  // (Integrated into Nutrition Agent responses in the demo)

  // --- 5. Grocery Agent (Barcode/Label - Extracted Voice parsing for this demo) ---
  async parseVoiceInput(transcript, userContext) {
    if (!this.isConfigured()) return getFallbackVoiceParse(transcript, userContext);

    const prompt = `You are a NutriMind Agent parsing voice logs. Return ONLY raw JSON:
{
  "foods": [{"name": "food", "portion": "amount", "estimatedCalories": 200}],
  "mealType": "type",
  "totalCalories": 400,
  "quickNote": "Behavioral insight note"
}
Input: "${transcript}"
${this.buildContext(userContext)}`;

    try {
      const result = await this.models.text.generateContent(prompt);
      return JSON.parse(result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch (e) {
      console.error('Voice Parsing Error:', e);
      return getFallbackVoiceParse(transcript, userContext);
    }
  }
}

// Singleton Orchestrator
export const orchestrator = new AgentOrchestrator();

export function isApiKeyConfigured() {
  return orchestrator.isConfigured();
}

// ==========================================
// FALLBACK DEMO DATA (No API Key)
// ==========================================

function getFallbackMealAnalysis(context) {
  const examMode = context?.examMode;
  return {
    foods: [
      { name: 'Chicken Biryani', portion: '1 large plate (~350g)' },
      { name: 'Raita', portion: '1 small bowl' },
    ],
    healthScore: examMode ? 55 : 62, // Lower score in exam mode due to carb crash
    calories: 680,
    macros: { protein: 32, carbs: 78, fat: 24, fiber: 4 },
    warnings: [
      'High refined carbohydrate content from basmati rice',
      examMode ? 'WARNING: High carb load will cause a major cognitive crash in 2 hours. Not ideal for studying.' : 'Moderate sodium from spices'
    ],
    positives: [
      'Good protein content from chicken',
      'Raita provides probiotics and calcium',
    ],
    energyCrashRisk: 'high',
    fullnessDuration: '3-4 hours',
    aiInsight: examMode 
      ? 'Exam Mode Alert: This meal will spike your blood sugar and cause brain fog around 3 PM. Swap half the rice for extra salad to maintain focus.'
      : 'You tend to choose biryani when stressed. Consider portion control to avoid the afternoon crash.',
  };
}

function getFallbackCoachResponse(message, context) {
  const lower = message.toLowerCase();
  const examMode = context?.examMode;

  if (examMode && lower.includes('study')) {
    return `🧠 **Exam Mode Active:** Your brain burns 20% more calories while studying intensively.\n\n**Focus Plan:**\n1. Drink 1 glass of water right now (dehydration kills focus).\n2. For your next snack, grab walnuts or almonds (Omega-3s = brain fuel).\n3. Avoid heavy carbs for dinner tonight so you don't feel groggy tomorrow morning.\n\nYou've got this! Let me know if you need a quick energy-boosting meal idea.`;
  }

  if (lower.includes('biryani')) {
    return `Great question! 🍚 Biryani can absolutely fit into a healthy diet.\n\n${examMode ? '**⚠️ Exam Alert:** A full plate will cause brain fog in 2 hours. If you must have it, eat only half the rice and double the chicken to keep your focus sharp.' : '**My recommendation:** Go for it! But use portion control (1 cup rice) and add a side salad for fiber to prevent an energy crash.'}`;
  }

  if (lower.includes('sugar') || lower.includes('craving') || lower.includes('sweet')) {
    return `I see you're craving sweets. Let me check your behavioral patterns... 🧠\n\n**Pattern detected:** You typically crave sugar when stressed, especially late at night. Today's stress signals are high.\n\n**Smart alternatives:**\n1. 🍌 Banana with peanut butter\n2. 🍫 2 squares of dark chocolate (70%+)\n\nIt's biology, not willpower. Feed the brain, don't fight it!`;
  }

  return `Welcome to the NutriMind AI Behavioral Coach! 🌿\n\nI'm not a calorie counter. I'm your contextual OS that learns *why* you eat the way you do.\n\n${examMode ? '📚 **EXAM MODE IS ON:** I will prioritize recommendations for focus, memory retention, and sustained energy.' : 'How can I help you optimize your energy today?'}`;
}

function getFallbackTwinData(context) {
  const examMode = context?.examMode;
  return {
    currentStatus: {
      energyLevel: examMode ? 5 : 6,
      sugarRisk: 7,
      processedFoodScore: 5,
      hydration: examMode ? 4 : 5,
      mealTiming: 6,
    },
    emotionalEatingScore: 8.5,
    projections: [
      { day: 7, event: examMode ? 'Brain fog and severe fatigue during afternoon study blocks' : 'Energy dips expected in afternoons', severity: 'high' },
      { day: 14, event: 'Late-night stress eating pattern solidifying', severity: 'high' }
    ],
    narrativeSummary: `Your emotional eating score rose to 8.5 this week, heavily correlated with late-night study sessions. Your late-night snacking increased 22%, mostly refined carbs. We need to intercept this pattern tonight with a high-protein dinner to stabilize your sleep architecture.`
  };
}

function getFallbackVoiceParse(transcript, context) {
  return {
    foods: [
      { name: 'Eggs', portion: '2 whole', estimatedCalories: 156 },
      { name: 'Paratha', portion: '1 medium', estimatedCalories: 260 },
    ],
    mealType: 'breakfast',
    totalCalories: 416,
    quickNote: context?.examMode 
      ? 'Great choline source for memory! But paratha might slow you down. Drink green tea.' 
      : 'Good protein start! Consider adding fruit for fiber.',
  };
}
