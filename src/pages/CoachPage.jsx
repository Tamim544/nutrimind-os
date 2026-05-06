import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, Bot, User, BookOpen } from 'lucide-react';
import { orchestrator } from '../services/gemini';

export default function CoachPage({ userContext }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I am your Nutrition Agent — the core of your NutriMind OS.\n\nI understand your behaviors and optimize your nutrition proactively. Ask me anything." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceParsing, setVoiceParsing] = useState(false);
  const chatEnd = useRef();
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.filter((m) => m.role !== 'system').map((m) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      content: m.content,
    }));

    const response = await orchestrator.chatWithCoach(text, history, userContext);
    setMessages((prev) => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [...prev, { role: 'ai', content: "Sorry, your browser doesn't support speech recognition. 🎙️" }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);

      const lower = transcript.toLowerCase();
      if (lower.includes('ate') || lower.includes('had') || lower.includes('eaten') || lower.includes('breakfast') || lower.includes('lunch') || lower.includes('dinner')) {
        setMessages((prev) => [...prev, { role: 'user', content: `🎙️ "${transcript}"` }]);
        setVoiceParsing(true);
        const parsed = await orchestrator.parseVoiceInput(transcript, userContext);
        setVoiceParsing(false);

        let logMsg = `✅ **Voice Logged & Parsed!**\n\n`;
        logMsg += `**Meal:** ${parsed.mealType}\n`;
        parsed.foods.forEach((f) => {
          logMsg += `• ${f.name} — ${f.portion} (~${f.estimatedCalories} cal)\n`;
        });
        logMsg += `\n**Total:** ${parsed.totalCalories} cal\n`;
        logMsg += `\n🧠 **Behavioral Note:** ${parsed.quickNote}`;

        setMessages((prev) => [...prev, { role: 'ai', content: logMsg }]);
      } else {
        sendMessage(transcript);
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const quickPrompts = userContext.examMode ? [
    'What should I eat before studying?',
    'How do I avoid brain fog?',
    "I'm craving sugar right now",
  ] : [
    'Can I eat biryani tonight?',
    "I'm craving sugar",
    'What should I eat for dinner?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--nav-height) - 40px)' }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--gradient-chat)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={20} color="white" />
            </div>
            <div>
              <h2 className="heading-md">Nutrition Agent</h2>
              <p className="text-small">Your AI-first behavioral interface</p>
            </div>
          </div>
          {userContext.examMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(59, 130, 246, 0.15)', padding: '4px 8px', borderRadius: 8 }}>
              <BookOpen size={14} color="var(--accent-blue)" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-blue)' }}>EXAM MODE</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 10,
          }}>
            {msg.role === 'ai' && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginRight: 8, marginTop: 4,
                background: 'var(--gradient-chat)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={14} color="white" />
              </div>
            )}
            <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
              style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginLeft: 8, marginTop: 4,
                background: 'var(--gradient-primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={14} color="white" />
              </div>
            )}
          </div>
        ))}

        {(loading || voiceParsing) && (
          <div style={{ display: 'flex', marginBottom: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginRight: 8,
              background: 'var(--gradient-chat)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={14} color="white" />
            </div>
            <div className="chat-bubble chat-bubble-ai">
              <div className="typing-indicator">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEnd} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
          {quickPrompts.map((p) => (
            <button key={p} className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px', whiteSpace: 'nowrap', flexShrink: 0 }}
              onClick={() => sendMessage(p)}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Voice Indicator */}
      {listening && (
        <div className="glass-card-static" style={{
          textAlign: 'center', padding: 12, marginBottom: 8,
          border: '1px solid var(--accent-green)', background: 'rgba(16,185,129,0.06)',
        }}>
          <div className="waveform-bars" style={{ marginBottom: 6 }}>
            {[...Array(7)].map((_, i) => <div key={i} className="waveform-bar" />)}
          </div>
          <p className="text-small" style={{ color: 'var(--accent-green)' }}>Voice Engine active... speak your meal or question</p>
        </div>
      )}

      {/* Input Bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={toggleVoice} style={{
          width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: listening ? 'var(--accent-red)' : 'var(--bg-glass)',
          color: listening ? 'white' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', flexShrink: 0,
        }}>
          {listening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <input className="input-field" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} placeholder="Talk to your Nutrition Agent..."
          style={{ flex: 1 }} />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: input.trim() ? 'var(--gradient-primary)' : 'var(--bg-glass)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', flexShrink: 0, opacity: input.trim() ? 1 : 0.5,
          }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
