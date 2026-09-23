import { useState, useEffect, useRef } from 'react';
import { User, Loader2, MessageSquare, Flame, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Dashboard = ({ userData }) => {
  const [bmiResult, setBmiResult] = useState(null);
  const [plans, setPlans] = useState({ diet: '', workout: '' });
  const [loading, setLoading] = useState({ diet: false, workout: false });
  const [error, setError] = useState({ diet: '', workout: '' });
  const [activeTab, setActiveTab] = useState('diet'); // 'diet', 'workout', 'chat'

  // Ref to track which tabs have been fetched to avoid double fetch in strict mode
  const fetchedRef = useRef({ diet: false, workout: false });

  useEffect(() => {
    if (userData) {
      fetchBmiInfo();
    }
  }, [userData]);

  useEffect(() => {
    // Automatically fetch content when a tab is visited and it hasn't been fetched yet
    if (bmiResult && (activeTab === 'diet' || activeTab === 'workout') && !fetchedRef.current[activeTab]) {
      fetchedRef.current[activeTab] = true;
      generatePlan(activeTab);
    }
  }, [activeTab, bmiResult]);

  const fetchBmiInfo = async () => {
    try {
      const bmiRes = await fetch('http://localhost:5000/api/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          weight: userData.weight, 
          height: userData.height,
          age: userData.age,
          gender: userData.gender,
          goal: userData.goal,
          lifestyle: userData.lifestyle
        })
      });
      if (!bmiRes.ok) throw new Error('Failed to calculate BMI');
      const bmiData = await bmiRes.json();
      setBmiResult(bmiData);
    } catch (err) {
      console.error(err);
    }
  };

  const generatePlan = async (type) => {
    try {
      setLoading(prev => ({ ...prev, [type]: true }));
      setError(prev => ({ ...prev, [type]: '' }));
      
      const payload = {
        advice_type: type,
        bmi_category: bmiResult.category,
        goal: userData.goal,
        lifestyle: userData.lifestyle,
        diet_pref: userData.diet_pref,
        diseases: userData.diseases
      };

      const aiRes = await fetch('http://localhost:5000/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!aiRes.ok) {
        throw new Error('Failed to connect to AI service.');
      }

      const reader = aiRes.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setPlans(prev => ({ ...prev, [type]: prev[type] + chunk }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="dashboard-container" style={{ paddingBottom: '40px' }}>
      
      {/* Top Summary Bar */}
      <div className="glass-panel animate-fade-in" style={{ padding: '1.2rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div className="flex items-center gap-4" style={{ minWidth: '220px' }}>
          <div style={{ background: 'var(--accent)', padding: '1rem', borderRadius: '50%', color: 'white' }}>
            <User size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Your Profile</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{userData.age}yo {userData.gender} • {userData.lifestyle}</p>
          </div>
        </div>
        
        <div className="flex justify-between w-full" style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>
          <div className="text-center">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>BMI</p>
            <h3 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.1rem' }}>{bmiResult ? bmiResult.bmi.toFixed(1) : '--'}</h3>
          </div>
          <div className="text-center">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Category</p>
            <h3 style={{ margin: 0, color: 'var(--success)', fontSize: '1.1rem' }}>{bmiResult ? bmiResult.category : '--'}</h3>
          </div>
          <div className="text-center">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>BMR</p>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{bmiResult ? `${bmiResult.bmr} kcal` : '--'}</h3>
          </div>
          <div className="text-center">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>TDEE</p>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{bmiResult ? `${bmiResult.tdee} kcal` : '--'}</h3>
          </div>
          <div className="text-center">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Goal</p>
            <h3 style={{ margin: 0, color: 'var(--warning)', fontSize: '1.1rem' }}>{userData.goal}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.1s', width: '100%', margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button onClick={() => setActiveTab('diet')} className={`tab-btn ${activeTab === 'diet' ? 'active' : ''}`}>Diet Plan</button>
          <button onClick={() => setActiveTab('workout')} className={`tab-btn ${activeTab === 'workout' ? 'active' : ''}`}>Workout Plan</button>
          <button onClick={() => setActiveTab('chat')} className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}>Chat Assistant</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s', minHeight: '400px' }}>
        
        {/* DIET OR WORKOUT CONTENT */}
        {(activeTab === 'diet' || activeTab === 'workout') && (
          <div>
            <div className="flex items-center gap-3 mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              {activeTab === 'diet' ? <Flame color="var(--error)" size={24} /> : <Activity color="var(--accent)" size={24} />}
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{activeTab === 'diet' ? 'Custom Diet Plan' : 'Custom Workout Plan'}</h2>
            </div>
            
            {loading[activeTab] && !plans[activeTab] && (
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--accent)', marginTop: '4rem' }}>
                  <Loader2 size={40} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>Generating your {activeTab} plan...</p>
               </div>
            )}

            {error[activeTab] && <div style={{ color: 'var(--error)' }}>{error[activeTab]}</div>}

            {plans[activeTab] && (
              <div className="markdown-content" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                <ReactMarkdown>{plans[activeTab]}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB CONTENT */}
        {activeTab === 'chat' && (
          <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center gap-3 mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              <MessageSquare color="var(--accent)" size={24} />
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>StayRight Assistant</h2>
            </div>
            <ChatInterface userData={userData} bmiCategory={bmiResult?.category} />
          </div>
        )}
      </div>

      <style>{`
        .tab-btn {
          padding: 0.5rem 0.5rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1.1rem;
          border-bottom: 2px solid transparent;
          border-radius: 0;
        }
        .tab-btn:hover {
          color: var(--text-primary);
        }
        .tab-btn.active {
          color: var(--accent);
          border-bottom: 2px solid var(--accent);
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .chat-markdown p { margin: 0; }
      `}</style>
    </div>
  );
};

const ChatInterface = ({ userData, bmiCategory }) => {
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hi! I am the StayRight Assistant. Do you have any questions about your plan?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const payload = {
        advice_type: 'chat',
        question: userMsg,
        bmi_category: bmiCategory,
        goal: userData.goal,
        lifestyle: userData.lifestyle,
        diet_pref: userData.diet_pref,
        diseases: userData.diseases
      };

      const aiRes = await fetch('http://localhost:5000/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const reader = aiRes.body.getReader();
      const decoder = new TextDecoder();
      
      setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text += chunk;
          return newMsgs;
        });
      }
    } catch (err) {
       setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
            <div style={{ 
              background: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg-secondary)', 
              color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
              padding: '1rem', 
              borderRadius: '12px',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
              borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '12px',
              border: msg.sender === 'ai' ? '1px solid var(--input-border)' : 'none',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              {msg.sender === 'ai' ? (
                <div className="markdown-content chat-markdown">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : msg.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', padding: '0.8rem', color: 'var(--text-secondary)' }}><Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /></div>}
      </div>

      <form onSubmit={handleSend} style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem' }}>
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Ask a question..." 
          className="input-field" 
          style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '12px' }} 
        />
        <button type="submit" className="btn" style={{ borderRadius: '12px', padding: '0 1.5rem' }} disabled={loading || !input.trim()}>
           Send
        </button>
      </form>
    </>
  );
};

export default Dashboard;
