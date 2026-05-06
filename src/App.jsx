import { useState } from 'react';
import { Home, Camera, MessageCircle, BarChart3, Presentation } from 'lucide-react';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import CoachPage from './pages/CoachPage';
import InsightsPage from './pages/InsightsPage';
import PitchPage from './pages/PitchPage';
import './App.css';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'scan', label: 'Scan', icon: Camera, isScan: true },
  { id: 'coach', label: 'Coach', icon: MessageCircle },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'pitch', label: 'Pitch', icon: Presentation },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [scanResult, setScanResult] = useState(null);
  
  // v2 Feature: Global Context State
  const [userContext, setUserContext] = useState({
    examMode: false,
  });

  const toggleExamMode = () => {
    setUserContext(prev => ({ ...prev, examMode: !prev.examMode }));
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage onNavigate={setActiveTab} userContext={userContext} toggleExamMode={toggleExamMode} />;
      case 'scan': return <ScanPage onResult={setScanResult} userContext={userContext} />;
      case 'coach': return <CoachPage userContext={userContext} />;
      case 'insights': return <InsightsPage userContext={userContext} />;
      case 'pitch': return <PitchPage />;
      default: return <HomePage onNavigate={setActiveTab} userContext={userContext} toggleExamMode={toggleExamMode} />;
    }
  };

  return (
    <div className="app-container">
      <div className="page-content">
        {renderPage()}
      </div>
      <nav className="bottom-nav">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          if (tab.isScan) {
            return (
              <button key={tab.id} className="nav-scan-btn" onClick={() => setActiveTab(tab.id)} aria-label="Scan meal">
                <Icon size={26} />
              </button>
            );
          }
          return (
            <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <Icon size={22} className="nav-icon" />
              <span className="nav-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
