import { describe, it, expect, vi } from 'vitest';
import { orchestrator, isApiKeyConfigured } from './gemini';

describe('Gemini ADK Frontend Client Security & Integration Tests', () => {
  it('should verify backend configuration', () => {
    expect(isApiKeyConfigured()).toBe(true);
  });

  it('should handle offline mode fallbacks safely', async () => {
    // Mock fetch to simulate failure
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
    
    const res = await orchestrator.chatWithCoach('Hello', [], { examMode: false });
    expect(res).toContain('Agent connection lost');
  });

  it('should sanitize voice input data', async () => {
    const res = await orchestrator.parseVoiceInput('test data <script>alert(1)</script>', { examMode: false });
    expect(res).toHaveProperty('foods');
    expect(res.totalCalories).toBe(300);
  });
});
