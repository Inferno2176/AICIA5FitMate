<div align="center">
  
# 🏋️ FitMate Lite

**An AI-Powered Fitness Companion**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

FitMate Lite is a lightweight, full-stack fitness companion application. It provides users with core BMI calculation capabilities and utilizes Google Gemini AI to offer highly personalized fitness and dietary advice based on the user's specific profile and goals.

</div>

---

## 🌟 Overview

This project is a modern technology stack migration (Java/Spring Boot ➡️ React/Python) of the core concepts described in the research paper:
> *"FitMate AI-Powered Fitness Companion", Patidar et al., IEEE ICTBIG 2024*

It features a stunning, glassmorphism-inspired UI with a built-in Dark/Light mode toggle, and a highly responsive streaming backend for instant AI feedback.

## ✨ Core Features

The application architecture is explicitly divided into two execution branches to separate deterministic calculations from generative AI responses.

### 1. 🧮 BMI Calculation Branch
- Users enter their Weight, Height, Age, Gender, and Fitness Goal.
- The React frontend sends this data to the Python backend.
- The Python backend calculates the BMI deterministically.
- The backend classifies the BMI into standard health categories (Underweight, Normal, Overweight, Obese).
- *Note: This branch operates purely on standard math and logic; it does not utilize AI.*

### 2. 🧠 Query Processing Branch
- Users can enter natural language fitness-related questions (e.g., *"What should I eat to build muscle?"*).
- The React frontend sends this question, along with the user's calculated BMI context, to the Python backend.
- The Python backend securely interfaces with the **Google Gemini API** (using the advanced `gemini-3.6-flash` model).
- The response is **streamed** directly back to the React UI in real-time, providing immediate feedback formatted in rich Markdown.

---

## 🚀 Setup & Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- **Python 3.10+**
- **Node.js 18+ and npm**
- **Google Gemini API Key** ([Get one from Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Configure the Backend (Python)
Navigate to the `backend` directory, set up your environment variables, and start the Flask server.

```bash
cd backend

# Create a .env file and add your API key:
echo 'GEMINI_API_KEY="your-api-key-here"' > .env

# Install the required dependencies:
pip install -r requirements.txt

# Start the Flask API server:
py app.py
# Note: Use `python app.py` or `python3 app.py` depending on your OS configuration.
```
*The backend API server typically runs on `http://localhost:5000`.*

### 2. Configure the Frontend (React)
Open a new terminal window, navigate to the `frontend` directory, install dependencies, and start the Vite development server.

```bash
cd frontend

# Install Node dependencies:
npm install

# Start the development server:
npm run dev
```
*The React development server typically runs on `http://localhost:5173`.*

---

## 🎮 Demo Script / Usage

Once both servers are running, follow these steps to see the app in action:

1. **Calculate BMI:** Fill in your weight, height, age, gender, and goal in the **BMI Calculator** card. Click **Calculate BMI**. The backend will deterministically return your BMI value and health category.
2. **Ask the AI:** In the **AI Fitness Advisor** card, type a question such as *"Give me a daily routine to follow."* and click **Ask AI**. 
3. **Experience the Stream:** Watch as the personalized advice streams seamlessly into the UI, fully aware of your BMI and fitness goals!

---

## 🗺️ Architecture Mapping (Research Paper)

The architecture of this project perfectly mirrors the components described in the original FitMate paper:

| Paper (Fig. 2 / Sec. IV) | This Repository |
|--------------------------|-----------------|
| User Inputs (Weight, Height, Age, Gender) | React Form Component |
| BMI Calculation Branch | Python Backend `/api/bmi` Endpoint |
| Classify BMI | Python Deterministic Logic |
| Query Processing Branch → OpenAI GPT-4 | Python Backend `/api/advice` Endpoint → Google Gemini |
| Error Handling | Python Backend Error Handling + React Validation |
| Frontend (Chat interface, BMI calculator) | React.js (Vite + Glassmorphism UI) |
| Backend (Node.js/Express in paper) | Python (Flask API Server) |

---

## 📁 Project Structure

```text
fitmate-lite/
├── README.md
├── frontend/                 # React UI
│   ├── package.json
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx           # Main Application Layout & Theme Management
│   │   ├── index.css         # Global Styles & Glassmorphism Theme
│   │   └── components/
│   │       ├── BmiCalculator.jsx  # BMI Calculation Form
│   │       └── AiAdvisor.jsx      # AI Streaming Chat Interface
│   └── ...
└── backend/                  # Python API Server
    ├── app.py                # Flask Server & Route Handlers
    ├── requirements.txt      # Python Dependencies
    └── .env.example          # Environment Variable Template
```

---

## ⚠️ Limitations (What's intentionally left out)

To keep this project lightweight and focused purely on demonstrating the core architecture, the following features have been intentionally omitted:

- **No Database:** All state is held in-memory within the React client. There is no stored history or persistence.
- **No User Auth:** There are no login or authentication systems.
- **No Wearables:** Wearable device integration is not implemented.
- **Single AI Call:** The AI processes a single model call per query without maintaining a conversational memory or chat history.

---

<div align="center">
  <i>Designed and built for modern web architectures.</i>
</div>
