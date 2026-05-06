import { useState, useEffect } from 'react';
import { Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Loader2, RefreshCw, Shield, Zap, BookOpen } from 'lucide-react';
import { orchestrator } from '../services/gemini';

const SEVERITY_MAP = {
  low: { color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  medium: { color: 'var(--accent-orange)', bg: 'rgba(245,158,11,0.1)', icon: AlertTriangle },
  high: { color: 'var(--accent-red)', bg: 'rgba(239,68,68,0.1)', icon: AlertTriangle },
};

const STATUS_LABELS = {
  energyLevel: { label: 'Energy', color: '#f59e0b' },
  sugarRisk: { label: 'Sugar Risk', color: '#ef4444' },
  processedFoodScore: { label: 'Processed Food', color: '#8b5cf6' },
  hydration: { label: 'Hydration', color: '#3b82f6' },
  mealTiming: { label: 'Meal Timing', color: '#14b8a6' },
};

export default function InsightsPage({ userContext }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const result = await orchestrator.generateDigitalTwin(userContext);
    setData(result);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [userContext.examMode]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 80 }}>
        <Loader2 size={36} color="var(--accent-green)" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p className="heading-md">Behavior Agent is thinking...</p>
        <p className="text-body" style={{ marginTop: 4 }}>Simulating 30-day health projections</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="stagger">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 className="heading-lg">AI Health Story</h2>
          <p className="text-body">Digital Twin Projections</p>
        </div>
        <button onClick={loadData} className="btn btn-ghost" style={{ padding: 8 }}>
          <RefreshCw size={18} />
        </button>
      </div>

      {userContext.examMode && (
        <div className="glass-card" style={{ marginBottom: 14, background: 'rgba(59, 130, 246, 0.15)', border: '1px solid var(--accent-blue)', padding: '10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={16} color="var(--accent-blue)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)' }}>Exam Mode Projections Active</span>
          </div>
        </div>
      )}

      {/* AI Storytelling Narrative */}
      <div className="glass-card" style={{
        marginBottom: 14, position: 'relative', overflow: 'hidden',
        borderLeft: `3px solid var(--accent-purple)`,
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 100, height: 100,
          background: `radial-gradient(circle, var(--accent-purple-glow), transparent)`,
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Brain size={20} color="var(--accent-purple)" />
          <span className="heading-md" style={{ color: 'var(--text-primary)' }}>
            Your Week in Review
          </span>
        </div>
        <p className="text-body" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
          {data.narrativeSummary}
        </p>
      </div>

      {/* Emotional Eating Score */}
      {data.emotionalEatingScore && (
        <div className="glass-card-static" style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>Emotional Eating Score</p>
            <p className="text-small">Correlates with stress triggers</p>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: data.emotionalEatingScore > 7 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {data.emotionalEatingScore}/10
          </div>
        </div>
      )}

      {/* Current Status */}
      <p className="section-label"><Shield size={13} /> Behavior Metrics</p>
      <div className="glass-card-static" style={{ marginBottom: 14 }}>
        {Object.entries(data.currentStatus).map(([key, val]) => {
          const meta = STATUS_LABELS[key] || { label: key, color: '#94a3b8' };
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 90, flexShrink: 0 }}>{meta.label}</span>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div className="progress-fill" style={{ width: `${val * 10}%`, background: meta.color }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: meta.color, width: 20, textAlign: 'right' }}>{val}</span>
            </div>
          );
        })}
      </div>

      {/* Timeline Projections */}
      <p className="section-label"><Zap size={13} /> 30-Day Projections</p>
      <div style={{ position: 'relative', paddingLeft: 24, marginBottom: 14 }}>
        <div style={{
          position: 'absolute', left: 7, top: 6, bottom: 6, width: 2,
          background: 'var(--border-subtle)', borderRadius: 1,
        }} />
        {data.projections.map((p, i) => {
          const sev = SEVERITY_MAP[p.severity] || SEVERITY_MAP.low;
          return (
            <div key={i} style={{ position: 'relative', marginBottom: 14 }}>
              <div style={{
                position: 'absolute', left: -20, top: 4, width: 12, height: 12,
                borderRadius: '50%', background: sev.color,
                boxShadow: `0 0 8px ${sev.color}44`,
              }} />
              <div className="glass-card-static" style={{ padding: 14, background: sev.bg, border: `1px solid ${sev.color}22` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span className="badge" style={{ background: `${sev.color}22`, color: sev.color }}>Day {p.day}</span>
                  <span className="badge" style={{ background: `${sev.color}22`, color: sev.color, textTransform: 'capitalize' }}>{p.severity} Impact</span>
                </div>
                <p className="text-body" style={{ color: 'var(--text-primary)' }}>{p.event}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <span className="badge badge-purple">Powered by Gemini Behavior Agent</span>
      </div>
    </div>
  );
}
