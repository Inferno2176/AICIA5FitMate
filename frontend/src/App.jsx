import { useState, useEffect } from 'react';
import { Sun, Moon, Activity } from 'lucide-react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      <header className="flex justify-between items-center mb-4" style={{ marginBottom: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <Activity size={32} color="var(--accent)" />
          <h1 className="text-gradient" style={{ margin: 0 }}>StayRight</h1>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main>
        {!userData ? (
          <Onboarding onComplete={setUserData} />
        ) : (
          <Dashboard userData={userData} />
        )}
      </main>
    </div>
  );
}

export default App;
