import React, { useState, useRef, memo } from 'react';
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle, Zap, Clock, ArrowRight, X } from 'lucide-react';
import { orchestrator } from '../services/gemini';

function ScanPage({ userContext, onNavigate }) {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      setImage(ev.target.result);
      setAnalyzing(true);
      setResult(null);
      const base64 = ev.target.result.split(',')[1];
      const data = await orchestrator.analyzeFoodImage(base64, file.type, userContext);
      setResult(data);
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => { setImage(null); setResult(null); setAnalyzing(false); };

  const scoreColor = (s) => s >= 80 ? 'var(--accent-green)' : s >= 50 ? 'var(--accent-orange)' : 'var(--accent-red)';

  return (
    <main className="stagger" role="main" aria-label="Camera Scanner">
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="heading-lg" style={{ marginBottom: 4 }}>Vision Agent Scanner</h2>
        <button aria-label="Close scanner" onClick={() => onNavigate?.('home')} className="btn btn-icon"><X size={20} /></button>
      </header>
      
      {!image ? (
        /* Upload Area */
        <div 
          role="button" 
          aria-label="Upload food image" 
          onClick={() => fileRef.current?.click()} 
          className="glass-card" 
          style={{
            textAlign: 'center', padding: '48px 20px', cursor: 'pointer',
            border: '2px dashed var(--border-medium)', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at center, var(--accent-green-glow), transparent 70%)',
            opacity: 0.3, pointerEvents: 'none',
          }} />
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
            background: 'var(--gradient-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Camera size={32} color="white" />
          </div>
          <p className="heading-md" style={{ marginBottom: 6 }}>Tap to Scan a Meal</p>
          <p className="text-body">Take a photo or upload an image</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <span className="badge badge-green">Gemini Vision Agent</span>
            <span className="badge badge-blue">ML Kit</span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
        </div>
      ) : (
        /* Image + Results */
        <div>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 16 }}>
            <img src={image} alt="Meal" style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'block' }} />
            {analyzing && <div className="scan-overlay" />}
            <button aria-label="Clear image" onClick={reset} style={{
              position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={16} />
            </button>
          </div>

          {analyzing && (
            <section aria-live="polite" className="glass-card" style={{ textAlign: 'center', padding: 32 }}>
              <Loader2 size={32} color="var(--accent-green)" className="animate-pulse" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
              <p className="heading-sm">Vision Agent Analyzing...</p>
              <p className="text-small">Identifying foods, estimating macros, scoring health</p>
            </section>
          )}

          {result && (
            <section aria-live="polite" aria-label="Analysis Results" className="stagger">
              {/* Health Score */}
              <div className="glass-card" style={{ textAlign: 'center', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at center, ${scoreColor(result.healthScore)}22, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <p className="section-label" style={{ justifyContent: 'center' }}>Health Score</p>
                <span style={{ fontSize: 56, fontWeight: 800, color: scoreColor(result.healthScore) }}>
                  {result.healthScore}
                </span>
                <span className="text-muted" style={{ fontSize: 18 }}>/100</span>
              </div>

              {/* Foods Detected */}
              <div className="glass-card-static" style={{ marginBottom: 12 }}>
                <p className="section-label">Foods Detected</p>
                {result.foods.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                    borderBottom: i < result.foods.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}>
                    <span className="heading-sm">{f.name}</span>
                    <span className="text-small">{f.portion}</span>
                  </div>
                ))}
              </div>

              {/* Macros */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto' }}>
                {[
                  { label: 'Calories', value: result.calories, unit: 'kcal', color: 'var(--accent-orange)' },
                  { label: 'Protein', value: result.macros.protein, unit: 'g', color: 'var(--accent-blue)' },
                  { label: 'Carbs', value: result.macros.carbs, unit: 'g', color: 'var(--accent-green)' },
                  { label: 'Fat', value: result.macros.fat, unit: 'g', color: 'var(--accent-red)' },
                ].map((m) => (
                  <div key={m.label} className="macro-pill" style={{ flex: 1 }}>
                    <span className="macro-value" style={{ color: m.color }}>{m.value}</span>
                    <span className="macro-label">{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {result.warnings?.length > 0 && (
                <div className="glass-card-static" style={{ marginBottom: 12, borderLeft: '3px solid var(--accent-orange)' }}>
                  <p className="section-label" style={{ color: 'var(--accent-orange)' }}>
                    <AlertTriangle size={14} /> Warnings
                  </p>
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-body" style={{ marginBottom: 4 }}>• {w}</p>
                  ))}
                </div>
              )}

              {/* Positives */}
              {result.positives?.length > 0 && (
                <div className="glass-card-static" style={{ marginBottom: 12, borderLeft: '3px solid var(--accent-green)' }}>
                  <p className="section-label" style={{ color: 'var(--accent-green)' }}>
                    <CheckCircle size={14} /> Positives
                  </p>
                  {result.positives.map((p, i) => (
                    <p key={i} className="text-body" style={{ marginBottom: 4 }}>• {p}</p>
                  ))}
                </div>
              )}

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div className="glass-card-static" style={{ padding: 14 }}>
                  <Zap size={14} color="var(--accent-orange)" />
                  <p className="text-small" style={{ marginTop: 4 }}>Energy Crash Risk</p>
                  <p className="heading-sm" style={{
                    color: result.energyCrashRisk === 'high' ? 'var(--accent-red)' :
                      result.energyCrashRisk === 'moderate' ? 'var(--accent-orange)' : 'var(--accent-green)',
                  }}>{result.energyCrashRisk}</p>
                </div>
                <div className="glass-card-static" style={{ padding: 14 }}>
                  <Clock size={14} color="var(--accent-blue)" />
                  <p className="text-small" style={{ marginTop: 4 }}>Fullness Duration</p>
                  <p className="heading-sm">{result.fullnessDuration}</p>
                </div>
              </div>

              {/* AI Insight */}
              <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-purple)' }}>
                <p className="section-label" style={{ color: 'var(--accent-purple)' }}>🧠 Behavior Agent Insight</p>
                <p className="text-body">{result.aiInsight}</p>
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}

export default memo(ScanPage);
