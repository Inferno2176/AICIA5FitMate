<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png" alt="Robot" width="100" />
  
  # FitMate Lite ✨

  **Your Intelligent, Real-Time Fitness Companion**
  
  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" /></a>
    <a href="https://python.org"><img src="https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini AI" /></a>
  </p>

  <p align="center">
    <i>FitMate Lite transforms standard BMI calculations into highly personalized, streaming fitness and dietary advice using the power of Google Gemini AI.</i>
  </p>
</div>

<br />

> 🏆 **Research Implementation**
> 
> This project is the modern technology stack migration (React + Python) of the core architecture described in the research paper: *"FitMate AI-Powered Fitness Companion", Patidar et al., IEEE ICTBIG 2024*.

---

## ✨ Features

- ⚡ **Instant BMI Analysis:** Deterministically calculates your BMI and classifies it instantly on the frontend.
- 🧠 **AI-Powered Advice:** Leverages Google's `gemini-3.6-flash` model to analyze your BMI, fitness goals, and custom queries.
- 🌊 **Real-Time Streaming:** AI responses are streamed directly to the UI, providing an ultra-fast, ChatGPT-like experience.
- 🎨 **Glassmorphism UI:** A stunning, premium frontend with a responsive glass-panel aesthetic and a global Dark/Light mode toggle.
- 📝 **Rich Markdown Rendering:** All AI advice is beautifully formatted in real-time with headings, bullet points, and bold text.

---

## 🚀 Quick Start

Get FitMate Lite running locally in under 2 minutes.

### 1️⃣ Clone & Configure Backend
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

### 2️⃣ Start the Frontend
Open a new terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser! 🎉

---

## 🏗️ Architecture

<details>
<summary><b>Click to view how the code maps to the research paper architecture</b></summary>
<br/>

| Paper Component (Fig. 2 / Sec. IV) | FitMate Lite Implementation |
|------------------------------------|-----------------------------|
| **User Inputs** (Weight, Height, Age, Gender) | React Form Component (`BmiCalculator.jsx`) |
| **BMI Calculation Branch** | Python Backend `/api/bmi` Endpoint |
| **BMI Classification** | Python Deterministic Logic |
| **Query Processing Branch** | Python Backend `/api/advice` Endpoint ➡️ Google Gemini |
| **Error Handling** | API Error Handling + React Validation State |
| **Frontend UI** | React.js (Vite + Custom Glassmorphism CSS) |
| **Backend Server** | Python (Flask API Server) |

</details>

<details>
<summary><b>Click to view the directory structure</b></summary>
<br/>

```text
fitmate-lite/
├── frontend/                 # React UI Workspace
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx           # Application Layout & Theme 
│   │   ├── index.css         # Glassmorphism Styles
│   │   └── components/
│   │       ├── BmiCalculator.jsx  
│   │       └── AiAdvisor.jsx      # Streaming Chat Interface
└── backend/                  # Python API Server
    ├── app.py                # Flask Server Routes
    ├── requirements.txt      
    └── .env.example          
```
</details>

---

## 🔒 Limitations & Scope

To keep this project lightweight and laser-focused on demonstrating the core AI architecture, the following features are intentionally omitted:
- 🗄️ **No Database:** All state is held temporarily in the React client.
- 👤 **No Authentication:** No user login or session management.
- ⌚ **No Wearable Integration:** Wearable data is not synced.
- 💬 **Stateless AI:** The AI processes a single query at a time without maintaining conversational memory.

<br />

<div align="center">
  <sub>Built with ❤️ for modern web architectures.</sub>
</div>
