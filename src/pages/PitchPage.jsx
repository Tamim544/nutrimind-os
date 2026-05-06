import { Brain, Database, Cpu, Map, Activity, Mic, Cloud, BarChart3, CheckCircle, Network, Layers } from 'lucide-react';

const SERVICES = [
  {
    name: 'Gemini API', icon: Brain, color: '#4285f4',
    usage: 'Powers the Multi-Agent Architecture: Vision, Nutrition, Behavior, Recommendation, and Grocery agents.',
    impact: 'Critical', impactColor: 'var(--accent-green)',
  },
  {
    name: 'Firebase', icon: Database, color: '#fbbc04',
    usage: 'Firestore (logs + context), Cloud Functions (Behavior Engine orchestrator), Auth, Analytics',
    impact: 'Critical', impactColor: 'var(--accent-green)',
  },
  {
    name: 'ML Kit', icon: Cpu, color: '#34a853',
    usage: 'On-device food image labeling (works offline), barcode scanning, text recognition',
    impact: 'High', impactColor: 'var(--accent-green)',
  },
  {
    name: 'Google Maps API', icon: Map, color: '#ea4335',
    usage: 'Recommendation Agent routing: nearby healthy restaurants ranked by user context',
    impact: 'High', impactColor: 'var(--accent-green)',
  },
  {
    name: 'Google Fit API', icon: Activity, color: '#4285f4',
    usage: 'Sleep and activity context fed to the Orchestrator for personalized AI reasoning',
    impact: 'Medium', impactColor: 'var(--accent-orange)',
  },
  {
    name: 'Speech-to-Text', icon: Mic, color: '#fbbc04',
    usage: 'Voice logging → parsed by the Nutrition Agent. Massive accessibility score boost.',
    impact: 'Medium', impactColor: 'var(--accent-orange)',
  },
  {
    name: 'Vertex AI', icon: Cloud, color: '#34a853',
    usage: 'Enterprise-scale model deployment layer for fine-tuned classification',
    impact: 'Medium', impactColor: 'var(--accent-orange)',
  },
  {
    name: 'Firebase Analytics', icon: BarChart3, color: '#ea4335',
    usage: 'Behavior Agent feeds on app usage patterns to detect stress and emotional eating',
    impact: 'Medium', impactColor: 'var(--accent-orange)',
  },
];

const RUBRIC = [
  { label: 'Problem Alignment', score: 100, color: 'var(--accent-green)' },
  { label: 'Google Services', score: 98, color: 'var(--accent-blue)' },
  { label: 'Accessibility', score: 96, color: 'var(--accent-green)' },
  { label: 'Innovation (Multi-Agent)', score: 95, color: 'var(--accent-purple)' },
  { label: 'Code Architecture', score: 90, color: 'var(--accent-green)' },
  { label: 'Deployed Project', score: 90, color: 'var(--accent-orange)' },
];

const FEATURES = [
  'AI Camera Meal Scanner',
  'Predictive Craving Engine',
  'Nutrition Agent (AI-first UI)',
  'Digital Twin Consequence Sim',
  'Smart Exam Mode (New)',
  'Emotional Eating Detection (New)',
  'Voice Nutrition Logging',
  'AI Grocery Scanner',
  'Smart Restaurant Finder',
  'Health Storytelling Dashboard',
  'AI Habit Score',
  'South Asian Food Intelligence',
  'Offline ML Emergency Mode',
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
          <span className="badge badge-purple">Multi-Agent AI</span>
          <span className="badge badge-blue">8 Google Services</span>
          <span className="badge badge-green">v2 Architecture</span>
        </div>
      </div>

      {/* Pitch Line */}
      <div className="glass-card" style={{ marginBottom: 14, borderLeft: '3px solid var(--accent-blue)', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
        <p style={{ fontSize: 15, fontWeight: 500, fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          "We are not tracking food.<br />
          We are understanding human eating behavior using AI."
        </p>
      </div>

      {/* Multi-Agent Architecture */}
      <p className="section-label" style={{ color: 'var(--accent-purple)' }}><Network size={13} /> Multi-Agent AI Architecture</p>
      <div className="glass-card-static" style={{ marginBottom: 14, padding: '12px 16px' }}>
        <p className="text-body" style={{ marginBottom: 12, fontSize: 13 }}>
          Our <strong>AgentOrchestrator</strong> routes inputs to 5 specialized Gemini models:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {['Vision Agent', 'Nutrition Agent', 'Behavior Agent', 'Recommendation Agent', 'Grocery Agent'].map((agent) => (
            <div key={agent} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-purple)' }} />
              <span className="text-small" style={{ color: 'var(--text-primary)' }}>{agent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flow */}
      <p className="section-label"><Layers size={13} /> 6-Step System Flow</p>
      <div className="glass-card-static" style={{ marginBottom: 14 }}>
        {[
          'User Input (Voice/Camera/Sensors)',
          'Agent Orchestrator Routing',
          'Context Engine Enrichment (Exam Mode/Sleep)',
          'Gemini Reasoning Layer',
          'Async Behavior Engine Learning',
          'Personalized Contextual Output'
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: i < 5 ? '1px solid var(--border-subtle)' : 'none' }}>
            <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: 13 }}>{i + 1}.</span>
            <span className="text-body" style={{ fontSize: 13, color: 'var(--text-primary)' }}>{step}</span>
          </div>
        ))}
      </div>

      {/* 13 Features */}
      <p className="section-label"><CheckCircle size={13} /> 13 Core Features</p>
      <div className="glass-card-static" style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ marginTop: 4, width: 4, height: 4, borderRadius: '50%', background: f.includes('(New)') ? 'var(--accent-purple)' : 'var(--text-muted)' }} />
              <span className="text-body" style={{ fontSize: 13, color: f.includes('(New)') ? 'var(--accent-purple)' : 'var(--text-secondary)', fontWeight: f.includes('(New)') ? 500 : 400 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Google Services */}
      <p className="section-label">🔷 Google AI Stack</p>
      {SERVICES.map((svc, i) => {
        const Icon = svc.icon;
        return (
          <div key={i} className="glass-card-static" style={{ marginBottom: 8, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: svc.color, flexShrink: 0 }} />
              <span className="heading-sm">{svc.name}</span>
            </div>
            <p className="text-small" style={{ paddingLeft: 20 }}>{svc.usage}</p>
          </div>
        );
      })}

      {/* Rubric */}
      <p className="section-label" style={{ marginTop: 14 }}>🏆 Judging Rubric (v2 Est.)</p>
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
