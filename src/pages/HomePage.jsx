import { Brain, Camera, Mic, TrendingUp, Sparkles, ChevronRight, Activity, Droplets, Moon, Flame, Clock, BookOpen, AlertCircle } from 'lucide-react';

const HABIT_AXES = [
  { label: 'Energy', value: 7, max: 10, icon: Flame, color: '#f59e0b' },
  { label: 'Hydration', value: 5, max: 10, icon: Droplets, color: '#3b82f6' },
  { label: 'Sleep', value: 6, max: 10, icon: Moon, color: '#8b5cf6' },
  { label: 'Nutrition', value: 7, max: 10, icon: Activity, color: '#10b981' },
  { label: 'Timing', value: 6, max: 10, icon: Clock, color: '#14b8a6' },
];

const QUICK_ACTIONS = [
  { label: 'Scan Meal', icon: Camera, tab: 'scan', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { label: 'Ask Coach', icon: Sparkles, tab: 'coach', gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
  { label: 'Voice Log', icon: Mic, tab: 'coach', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { label: 'Insights', icon: TrendingUp, tab: 'insights', gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
];

export default function HomePage({ onNavigate, userContext, toggleExamMode }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="stagger">
      {/* Hero Section */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="animate-breathe" style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={26} color="white" />
            </div>
            <div>
              <h1 className="heading-lg">{greeting} 👋</h1>
              <p className="text-small">NutriMind OS is analyzing your patterns</p>
            </div>
          </div>
        </div>
      </div>

      {/* v2: EXAM MODE TOGGLE */}
      <div className="glass-card" style={{ 
        marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: userContext.examMode ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-glass)',
        border: userContext.examMode ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
        transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 10, 
            background: userContext.examMode ? 'var(--accent-blue)' : 'var(--bg-secondary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <BookOpen size={18} color={userContext.examMode ? 'white' : 'var(--text-muted)'} />
          </div>
          <div>
            <p className="heading-sm" style={{ color: userContext.examMode ? 'var(--accent-blue)' : 'var(--text-primary)' }}>Smart Exam Mode</p>
            <p className="text-small">{userContext.examMode ? 'Focus & energy logic active' : 'Optimize for studying'}</p>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <div 
          onClick={toggleExamMode}
          style={{
            width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
            background: userContext.examMode ? 'var(--accent-blue)' : 'var(--bg-secondary)',
            position: 'relative', transition: 'all 0.3s'
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: '50%', background: 'white',
            position: 'absolute', top: 2, left: userContext.examMode ? 22 : 2,
            transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
        </div>
      </div>

      {/* AI Habit Score Card */}
      <div className="glass-card" style={{ marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 120, height: 120,
          background: 'radial-gradient(circle, var(--accent-green-glow), transparent)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>Today's Health Score</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 42, fontWeight: 800, background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>72</span>
              <span className="text-small">/100</span>
            </div>
          </div>
          <div className="animate-float" style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--gradient-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px var(--accent-green-glow)',
          }}>
            <Sparkles size={28} color="white" />
          </div>
        </div>

        {/* 5-Axis Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HABIT_AXES.map((axis) => {
            const Icon = axis.icon;
            return (
              <div key={axis.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={14} color={axis.color} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 60, flexShrink: 0 }}>{axis.label}</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${(axis.value / axis.max) * 100}%`, background: axis.color }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: axis.color, width: 20, textAlign: 'right' }}>{axis.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* v2: EMOTIONAL EATING DETECTION */}
      <div className="glass-card" style={{ marginBottom: 16, borderLeft: '3px solid var(--accent-purple)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AlertCircle size={18} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="heading-sm" style={{ marginBottom: 4, color: 'var(--accent-purple)' }}>Emotional Eating Detected</p>
            <p className="text-body" style={{ fontSize: 13 }}>You've ordered late-night food 3 times this week. This strongly correlates with your stress patterns in the evening. Let's talk about it.</p>
            <button className="btn btn-ghost" style={{ marginTop: 8, color: 'var(--accent-purple)', padding: '4px 0', fontSize: 13 }}
              onClick={() => onNavigate('coach')}>
              Talk to AI Coach <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <p className="section-label">Quick Actions</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.label} className="glass-card" onClick={() => onNavigate(action.tab)}
              style={{ cursor: 'pointer', textAlign: 'center', padding: 16, border: 'none', background: 'var(--bg-glass)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: action.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px',
              }}>
                <Icon size={22} color="white" />
              </div>
              <span className="heading-sm" style={{ color: 'var(--text-primary)' }}>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recent Meals */}
      <p className="section-label">Recent Meals</p>
      <div className="glass-card-static" style={{ marginBottom: 16 }}>
        {[
          { time: '8:30 AM', meal: 'Eggs + Paratha', cal: 416, score: 74 },
          { time: '1:15 PM', meal: 'Dal + Brown Rice + Salad', cal: 520, score: 85 },
        ].map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: i === 0 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <div>
              <p className="heading-sm">{m.meal}</p>
              <p className="text-small">{m.time} · {m.cal} cal</p>
            </div>
            <div style={{
              padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600,
              background: m.score >= 80 ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
              color: m.score >= 80 ? 'var(--accent-green)' : 'var(--accent-orange)',
            }}>
              {m.score}/100
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
