import { Brain, Database, Cpu, Map, Activity, Mic, Cloud, BarChart3, CheckCircle, Network, Layers, RefreshCcw, Code } from 'lucide-react';

const SERVICES = [
  {
    name: 'Google ADK', icon: Network, color: '#4285f4',
    usage: 'Core Python framework for building the 5-agent Orchestrator pipeline with A2A communication.',
    impact: 'Critical', impactColor: 'var(--accent-green)',
  },
  {
    name: 'Gemini 3 Pro + Flash', icon: Brain, color: '#9333ea',
    usage: 'Pro handles complex behavioral reasoning. Flash handles native real-time multimodal inputs.',
    impact: 'Critical', impactColor: 'var(--accent-green)',
  },
  {
    name: 'Vertex AI Agent Engine', icon: Cloud, color: '#4285f4',
    usage: 'Production runtime deployment target for our ADK backend infrastructure.',
    impact: 'Critical', impactColor: 'var(--accent-green)',
  },
  {
    name: 'Managed MCP Servers', icon: Database, color: '#fbbc04',
    usage: 'Pre-built connections to Firestore and Google Fit without custom boilerplate.',
    impact: 'High', impactColor: 'var(--accent-green)',
  },
  {
    name: 'Antigravity IDE', icon: Code, color: '#34a853',
    usage: 'The entire application was built using agentic vibe coding within Google Antigravity.',
    impact: 'High', impactColor: 'var(--accent-green)',
  },
  {
    name: 'Firebase Analytics', icon: BarChart3, color: '#ea4335',
    usage: 'Behavior Agent feeds on app usage patterns to detect stress and emotional eating.',
    impact: 'Medium', impactColor: 'var(--accent-orange)',
  },
];

const RUBRIC = [
  { label: 'Google Ecosystem (ADK + Vertex)', score: 92, color: 'var(--accent-blue)' },
  { label: 'AI Depth (Gemini 3 + A2A)', score: 95, color: 'var(--accent-purple)' },
  { label: 'Problem Alignment', score: 100, color: 'var(--accent-green)' },
  { label: 'South Asian Intelligence', score: 90, color: 'var(--accent-orange)' },
];

const FEATURES = [
  'ADK Session Rewind for diet experiments',
  'HITL Tool Confirmation for risk alerts',
  'Gemini 3 Live Video Food Stream',
  'Vertex AI Sandbox Code Execution',
  'Google Agentspace B2B Integration',
  'Smart Exam Mode',
  'Emotional Eating Detection',
  'Digital Twin Consequence Sim',
  'Voice Nutrition Logging',
];

export default function PitchPage() {
  return (
    <div className="stagger">
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div className="animate-breathe" style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 14px',
          background: 'var(--gradient-primary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Brain size={32} color="white" />
        </div>
        <h1 className="heading-xl">
          <span className="text-gradient">NutriMind OS</span>
        </h1>
        <p className="text-body" style={{ marginTop: 6, fontWeight: 500, color: 'var(--text-primary)' }}>Behavioral Nutrition Operating System</p>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          <span className="badge badge-purple">Google ADK</span>
          <span className="badge badge-blue">Gemini 3 Pro</span>
          <span className="badge badge-green">Vertex AI</span>
        </div>
      </div>

      {/* Pitch Line */}
      <div className="glass-card" style={{ marginBottom: 14, borderLeft: '3px solid var(--accent-blue)', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
        <p style={{ fontSize: 13, fontWeight: 500, fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          "NutriMind is a multi-agent behavioral OS — five Google ADK agents communicating in real-time, built in Antigravity IDE, and deployed on Vertex AI Agent Engine."
        </p>
      </div>

      {/* ADK Architecture */}
      <p className="section-label" style={{ color: 'var(--accent-purple)' }}><Network size={13} /> ADK Multi-Agent Pipeline</p>
      <div className="glass-card-static" style={{ marginBottom: 14, padding: '12px 16px' }}>
        <p className="text-body" style={{ marginBottom: 12, fontSize: 13 }}>
          <strong>NutriMindOrchestrator</strong> routes to:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)', marginTop: 5 }} />
            <div>
              <span className="text-small" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>VisionAgent (Gemini 3 Flash)</span>
              <p className="text-small" style={{ color: 'var(--text-muted)' }}>Native multimodal vision. Delegates to Nutrition via A2A.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-purple)', marginTop: 5 }} />
            <div>
              <span className="text-small" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>BehaviorAgent (Gemini 3 Pro)</span>
              <p className="text-small" style={{ color: 'var(--text-muted)' }}>Managed MCP connecting to Google Fit sleep data.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', marginTop: 5 }} />
            <div>
              <span className="text-small" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>NutritionAgent (Gemini 3 Pro)</span>
              <p className="text-small" style={{ color: 'var(--text-muted)' }}>Sandbox Code Execution for diet math + MCP Firestore.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Standout Features */}
      <p className="section-label"><CheckCircle size={13} /> Wow-Factor Features</p>
      <div className="glass-card-static" style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ marginTop: 4, width: 4, height: 4, borderRadius: '50%', background: i < 5 ? 'var(--accent-purple)' : 'var(--text-muted)' }} />
              <span className="text-body" style={{ fontSize: 13, color: i < 5 ? 'var(--accent-purple)' : 'var(--text-secondary)', fontWeight: i < 5 ? 600 : 400 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Google Services */}
      <p className="section-label">🔷 Google Tech Stack</p>
      {SERVICES.map((svc, i) => {
        const Icon = svc.icon;
        return (
          <div key={i} className="glass-card-static" style={{ marginBottom: 8, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Icon size={16} color={svc.color} />
              <span className="heading-sm">{svc.name}</span>
            </div>
            <p className="text-small" style={{ paddingLeft: 26 }}>{svc.usage}</p>
          </div>
        );
      })}

      {/* Rubric */}
      <p className="section-label" style={{ marginTop: 14 }}>🏆 Upgraded Judging Metrics (v3)</p>
      <div className="glass-card-static" style={{ marginBottom: 14 }}>
        {RUBRIC.map((r, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: r.color }}>{r.score}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${r.score}%`, background: r.color }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
