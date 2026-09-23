import { useState } from 'react';
import { Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AiAdvisor = ({ bmiData }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [advice, setAdvice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bmiData) {
      setError('Please calculate your BMI first so the AI can give personalized advice.');
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const payload = {
        question,
        bmi_category: bmiData.category,
        goal: bmiData.goal
      };

      setAdvice('');
      const response = await fetch('http://localhost:5000/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to connect to AI service.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setAdvice(prev => prev + chunk);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to AI service. Please make sure the backend is running and GEMINI_API_KEY is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center gap-4 mb-4">
        <Sparkles color="var(--accent)" />
        <h2 style={{ margin: 0 }}>AI Fitness Advisor</h2>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ask FitMate AI for personalized diet and workout plans based on your profile.
      </p>

      <form onSubmit={handleSubmit} className="flex-col" style={{ flex: 1 }}>
        <div className="input-group w-full" style={{ flex: 1 }}>
          <label htmlFor="question">Your Question</label>
          <textarea 
            id="question" 
            className="input-field" 
            rows="4"
            placeholder="e.g. What should I eat to build muscle?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ resize: 'none', height: '100px' }}
          />
        </div>

        {error && (
          <div className="flex items-center gap-4 mb-4" style={{ color: 'var(--error)', fontSize: '0.9rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="btn" disabled={loading || !bmiData}>
          <MessageSquare size={18} />
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>

      {advice && (
        <div className="mt-4 p-4 markdown-content" style={{ 
          background: 'var(--bg-secondary)', 
          borderRadius: '16px', 
          border: '1px solid var(--input-border)',
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: '1.05rem'
        }}>
          <ReactMarkdown>{advice}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AiAdvisor;
