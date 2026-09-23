import { useState } from 'react';
import { ChevronRight, ChevronLeft, Activity, Target, HeartPulse, Utensils, Zap } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'Male',
    diet_pref: 'Vegetarian', // default since 'None' is removed
    lifestyle: 'Sedentary',
    goal: 'General Fitness',
    diseases: [],
    other_disease: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePillSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiseaseToggle = (disease) => {
    setFormData(prev => {
      if (disease === 'None') {
        return { ...prev, diseases: ['None'], other_disease: '' };
      }
      const newDiseases = prev.diseases.filter(d => d !== 'None');
      if (newDiseases.includes(disease)) {
        return { ...prev, diseases: newDiseases.filter(d => d !== disease) };
      } else {
        return { ...prev, diseases: [...newDiseases, disease] };
      }
    });
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalDiseases = [...formData.diseases];
    if (formData.other_disease.trim()) {
      finalDiseases.push(formData.other_disease.trim());
    }
    const filteredDiseases = finalDiseases.filter(d => d !== 'None');
    onComplete({ ...formData, diseases: filteredDiseases.length > 0 ? filteredDiseases : [] });
  };

  const isStep1Valid = formData.weight && formData.height && formData.age;
  const isStep5Valid = formData.diseases.length > 0 || formData.other_disease.trim() !== '';

  return (
    <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ margin: 0, fontSize: '1.4rem' }} className="text-gradient">
          {step === 1 && 'Body Metrics'}
          {step === 2 && 'Dietary Preferences'}
          {step === 3 && 'Lifestyle'}
          {step === 4 && 'Fitness Goal'}
          {step === 5 && 'Health & Medical'}
        </h2>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Step {step} of 5</span>
      </div>

      <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} style={{ display: 'flex', flexDirection: 'column' }}>
        
        <div>
          {/* STEP 1: Body Metrics */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-4"><Activity size={36} color="var(--accent)" opacity={0.8}/></div>
              <div className="grid-layout" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '0.5rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Weight (kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="input-field" required min="20" max="300" placeholder="70" />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Height (cm)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} className="input-field" required min="100" max="250" placeholder="175" />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" required min="10" max="100" placeholder="25" />
                </div>
              </div>
              <div className="input-group w-full mt-2">
                <label>Gender</label>
                <div className="pill-container">
                  {['Male', 'Female', 'Other'].map(g => (
                    <div 
                      key={g} 
                      className={`pill-option ${formData.gender === g ? 'selected' : ''}`}
                      onClick={() => handlePillSelect('gender', g)}
                    >
                      {g}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Dietary Preferences */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-4"><Utensils size={36} color="var(--accent)" opacity={0.8}/></div>
              <div className="input-group w-full">
                <label>What are your dietary preferences?</label>
                <div className="pill-grid">
                  {['Vegetarian', 'Vegan', 'Paleo', 'Keto', 'Non-Vegetarian', 'Pescatarian'].map(diet => (
                    <div 
                      key={diet} 
                      className={`pill-option text-center ${formData.diet_pref === diet ? 'selected' : ''}`}
                      onClick={() => handlePillSelect('diet_pref', diet)}
                      style={{ padding: '0.8rem 1rem' }}
                    >
                      {diet}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Lifestyle */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-4"><Zap size={36} color="var(--accent)" opacity={0.8}/></div>
              <div className="input-group w-full">
                <label>How active is your lifestyle?</label>
                <div className="pill-grid">
                  {[
                    { val: 'Sedentary', desc: 'Little to no exercise' },
                    { val: 'Lightly Active', desc: 'Sports 1-3 days/wk' },
                    { val: 'Moderately Active', desc: 'Sports 3-5 days/wk' },
                    { val: 'Very Active', desc: 'Hard sports 6-7 days/wk' }
                  ].map(life => (
                    <div 
                      key={life.val} 
                      className={`pill-option ${formData.lifestyle === life.val ? 'selected' : ''}`}
                      onClick={() => handlePillSelect('lifestyle', life.val)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0.8rem 1rem' }}
                    >
                      <span style={{ fontSize: '1rem', fontWeight: 600 }}>{life.val}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 400 }}>{life.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Primary Goal */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-4"><Target size={36} color="var(--accent)" opacity={0.8}/></div>
              <div className="input-group w-full">
                <label>What is your primary fitness goal?</label>
                <div className="pill-grid">
                  {['Weight Loss', 'Muscle Gain', 'Maintenance', 'General Fitness'].map(goal => (
                    <div 
                      key={goal} 
                      className={`pill-option text-center ${formData.goal === goal ? 'selected' : ''}`}
                      onClick={() => handlePillSelect('goal', goal)}
                      style={{ padding: '1rem' }}
                    >
                      {goal}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Health & Medical */}
          {step === 5 && (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-4"><HeartPulse size={36} color="var(--accent)" opacity={0.8}/></div>
              
              <div className="input-group w-full" style={{ marginBottom: '0.5rem' }}>
                <label>Existing Health Conditions</label>
                <div className="pill-grid">
                  {['Obesity', 'Diabetes', 'Asthma', 'High Cholesterol', 'Heart Diseases', 'PCOS/PCOD'].map(disease => (
                    <div 
                      key={disease} 
                      className={`pill-option text-center ${formData.diseases.includes(disease) ? 'selected' : ''}`}
                      onClick={() => handleDiseaseToggle(disease)}
                      style={{ padding: '0.8rem' }}
                    >
                      {disease}
                    </div>
                  ))}
                  <div 
                    className={`pill-option text-center ${formData.diseases.includes('None') ? 'selected' : ''}`}
                    onClick={() => handleDiseaseToggle('None')}
                    style={{ padding: '0.8rem', gridColumn: 'span 2', background: formData.diseases.includes('None') ? 'var(--accent)' : 'var(--bg-secondary)' }}
                  >
                    None
                  </div>
                </div>
              </div>

              <div className="input-group w-full mt-2" style={{ marginBottom: '1.5rem' }}>
                <label>Other Conditions (Optional)</label>
                <input 
                  type="text" 
                  name="other_disease" 
                  value={formData.other_disease} 
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value.trim() !== '' && formData.diseases.includes('None')) {
                      setFormData(prev => ({ ...prev, diseases: prev.diseases.filter(d => d !== 'None') }));
                    }
                  }} 
                  className="input-field" 
                  style={{ padding: '0.6rem 1rem' }}
                  placeholder="e.g. Peanut Allergy" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="btn" style={{ background: 'var(--input-bg)', color: 'var(--text-primary)', padding: '0.6rem 1.2rem' }}>
              <ChevronLeft size={18} /> Back
            </button>
          ) : <div></div>}

          {step < 5 ? (
            <button type="submit" className="btn" disabled={step === 1 && !isStep1Valid} style={{ padding: '0.6rem 1.2rem' }}>
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button type="submit" className="btn" disabled={!isStep5Valid} style={{ padding: '0.6rem 1.2rem' }}>
              Generate Plan <SparklesIcon />
            </button>
          )}
        </div>
      </form>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(5px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

const SparklesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.2rem' }}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default Onboarding;
