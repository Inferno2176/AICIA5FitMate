import { useState } from 'react';
import axios from 'axios';
import { Calculator, AlertCircle } from 'lucide-react';

const BmiCalculator = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'Male',
    goal: 'Weight Loss'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Typically the backend runs on port 5000 in development
      const response = await axios.post('http://localhost:5000/api/bmi', formData);
      setResult(response.data);
      onCalculate(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <div className="flex items-center gap-4 mb-4">
        <Calculator color="var(--accent)" />
        <h2 style={{ margin: 0 }}>BMI Calculator</h2>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Enter your details to calculate your Body Mass Index (BMI).
      </p>

      <form onSubmit={handleSubmit} className="flex-col">
        <div className="flex gap-4">
          <div className="input-group w-full">
            <label htmlFor="weight">Weight (kg)</label>
            <input 
              type="number" 
              id="weight" 
              name="weight" 
              className="input-field" 
              value={formData.weight} 
              onChange={handleChange} 
              required 
              step="0.1"
            />
          </div>
          <div className="input-group w-full">
            <label htmlFor="height">Height (cm)</label>
            <input 
              type="number" 
              id="height" 
              name="height" 
              className="input-field" 
              value={formData.height} 
              onChange={handleChange} 
              required 
              step="0.1"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="input-group w-full">
            <label htmlFor="age">Age</label>
            <input 
              type="number" 
              id="age" 
              name="age" 
              className="input-field" 
              value={formData.age} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group w-full">
            <label htmlFor="gender">Gender</label>
            <select 
              id="gender" 
              name="gender" 
              className="input-field" 
              value={formData.gender} 
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="input-group w-full">
          <label htmlFor="goal">Fitness Goal</label>
          <select 
            id="goal" 
            name="goal" 
            className="input-field" 
            value={formData.goal} 
            onChange={handleChange}
          >
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Maintenance">Maintenance</option>
            <option value="General Fitness">General Fitness</option>
          </select>
        </div>

        {error && (
          <div className="flex items-center gap-4 mt-4 mb-4" style={{ color: 'var(--error)', fontSize: '0.9rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="btn mt-4" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate BMI'}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4" style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--input-border)' }}>
          <h3 className="text-center text-gradient" style={{ fontSize: '2rem', margin: 0 }}>{result.bmi}</h3>
          <p className="text-center" style={{ color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.5rem' }}>
            {result.category}
          </p>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;
