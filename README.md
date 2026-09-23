<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png" alt="Robot" width="100" />
  
  <h1>StayRight</h1>

  **Your Intelligent, Real-Time Fitness & Nutrition Companion**
  
  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" /></a>
    <a href="https://python.org"><img src="https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini AI" /></a>
  </p>

  <p align="center">
    <i>StayRight (formerly FitMate) transforms standard health metrics into highly personalized, streaming fitness and dietary advice using the power of Google Gemini AI.</i>
  </p>
</div>

<br />

> **Research Implementation**
> 
> This project is the modern technology stack migration (React + Python) of the core architecture described in the research paper: *"FitMate AI-Powered Fitness Companion", Patidar et al., IEEE ICTBIG 2024*.

---

## Features

- **Comprehensive Health Metrics:** Instantly calculates your BMI, BMR (Mifflin-St Jeor), and Total Daily Energy Expenditure (TDEE).
- **AI-Powered Tabbed Architecture:** Dedicated AI-generated tabs for your Custom Diet Plan, Custom Workout Plan, and an interactive Chat Assistant.
- **Real-Time Streaming:** AI responses are streamed directly to the UI, providing an ultra-fast, professional experience with built-in multi-model fallback.
- **Premium UI:** A stunning frontend featuring a multi-step onboarding wizard, responsive glass-panel aesthetics, and a global Dark/Light mode toggle.
- **Health Condition Aware:** The AI strictly tailors advice to respect existing diseases (like PCOS, Diabetes, Asthma, or Heart Disease) and dietary preferences (Vegan, Paleo, etc.).

---

## Quick Start

Get StayRight running locally in under 2 minutes.

### 1️. Clone & Configure Backend
```bash
# Clone the repository
git clone https://github.com/Inferno2176/AICIA5FitMate.git
cd AICIA5FitMate

# Setup Backend Environment
cd backend
echo 'GEMINI_API_KEY="your-gemini-api-key"' > .env
pip install -r requirements.txt
python app.py
```

### 2️. Start the Frontend
Open a new terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser!

---

## Screenshots

### Light and Dark theme
<p align="center">
  <img src="assets/stayright_1.png" alt="Dashboard Overview (Light Mode)" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" />
</p>
  
### Multi-Step Onboarding
<p align="center">
  <img src="assets/stayright_6.png" alt="Body Metrics (Dark Mode)" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" />
  <img src="assets/stayright_5.png" alt="Dietary Preferences (Dark Mode)" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" />
  <img src="assets/stayright_2.png" alt="Lifestyle (Dark Mode)" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" />
  <img src="assets/stayright_4.png" alt="Fitness Goal (Dark Mode)" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" />
  <img src="assets/stayright_3.png" alt="Health and Medical (Dark Mode)" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" />
</p>

### Tabbed Dashboard & AI Engine
<p align="center">
  <img src="assets/stayright_7.png" alt="Diet Plan" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" />
  <img src="assets/stayright_10.png" alt="Workout Plan" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" />
  <img src="assets/stayright_11.png" alt="Chat Assisstant" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;" />
</p>

---

## Architecture Flow

```mermaid
sequenceDiagram
    participant User
    participant React UI
    participant Flask Backend
    participant Google Gemini

    User->>React UI: Completes 5-step Onboarding Flow
    React UI->>Flask Backend: POST /api/bmi {metrics, lifestyle, diseases}
    Flask Backend-->>React UI: JSON {bmi, bmr, tdee, category}
    
    React UI->>Flask Backend: Auto-triggers POST /api/advice {type: 'diet'}
    Flask Backend->>Google Gemini: Context-Aware Prompt (Strictly Professional)
    Google Gemini-->>Flask Backend: Streams Answer Chunks
    Flask Backend-->>React UI: Streams Data (Text/Plain)
    React UI-->>User: Renders Diet Plan Markdown in Real-Time
    
    User->>React UI: Clicks 'Workout Plan' or 'Chat' Tab
    React UI->>Flask Backend: POST /api/advice {type: 'workout' / 'chat'}
    Flask Backend->>Google Gemini: Dedicated Sub-Prompt
    Google Gemini-->>React UI: Streams Dedicated Content
```

<details>
<summary><b>Click to view how the code maps to the research paper architecture</b></summary>
<br/>

- **Data Collection Module:** Implemented via the sleek React `<Onboarding />` wizard which captures age, weight, height, lifestyle, and diseases.
- **Decision Engine (Rule-based):** `calculate_bmr` and `calculate_tdee` in `backend/app.py` process the physical parameters deterministically.
- **Generative AI Module:** Implemented via `google-generativeai` utilizing `gemini-3.6-flash` as the core reasoning engine.
- **User Interface Layer:** React Vite app running a custom glassmorphism design system in `index.css`.
</details>

---

## 🛠️ Built With
- **Frontend:** React 18, Vite, Lucide React (Icons), React Markdown
- **Backend:** Python 3, Flask, Flask-CORS
- **AI Integration:** Google Generative AI Python SDK
