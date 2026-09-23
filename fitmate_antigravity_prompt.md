# Antigravity Prompt — FitMate Lite Technology Stack Migration

Update the existing `README.md` for the FitMate Lite project.

IMPORTANT: Do not change the project's intended functionality or scope. Only update the technology stack, setup instructions, project structure, and references so that the project uses:

- **Frontend:** React.js
- **Backend:** Python
- **AI:** Google Gemini API
- **No Java**
- **No Spring Boot**
- **No Maven**

## Required changes

### 1. Replace all Java/Spring Boot references

- Remove every reference to Java.
- Remove every reference to Spring Boot.
- Remove Maven commands such as `mvn spring-boot:run`.
- Remove IntelliJ/Eclipse Java-specific instructions.
- Do not mention `BmiService.java`, `GeminiService.java`, `BmiController`, `AdviceController`, or any other Java classes.

### 2. Update the technology description

The project should now be described as:

- React.js frontend for the UI.
- Python backend for BMI calculation and API handling.
- Google Gemini API for AI-powered fitness advice.

### 3. Keep the same two main branches

Preserve the existing functionality.

**BMI Calculation Branch**

- User enters weight, height, age, gender, and goal.
- The Python backend calculates BMI.
- The backend classifies the BMI as Underweight, Normal, Overweight, or Obese.
- This calculation does NOT use AI.

**Query Processing Branch**

- User enters a fitness-related question.
- The React frontend sends the question along with the user's BMI category and goal to the Python backend.
- The Python backend sends this information to Google Gemini.
- Gemini returns personalised fitness advice.
- The result is displayed in the React frontend.

### 4. Update the setup instructions

Replace the Java/Maven setup with React + Python setup.

The README should explain prerequisites such as:

- Python 3.x
- Node.js and npm
- Google Gemini API key

Include appropriate commands for installing dependencies and running both servers.

Use a structure similar to:

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

**Backend:**

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Adjust these commands if the actual project structure uses different filenames, but keep the instructions accurate and consistent.

### 5. Update the Gemini API key instructions

Keep the existing explanation about obtaining a Gemini API key, but change the environment-variable/setup instructions so they are appropriate for a Python backend.

Example:

**Windows PowerShell:**

```powershell
$env:GEMINI_API_KEY="your-key-here"
```

**Mac/Linux:**

```bash
export GEMINI_API_KEY="your-key-here"
```

If the Python implementation uses a `.env` file, document that approach instead and mention the required package/configuration.

### 6. Update the application URLs

Do not claim that everything runs from `http://localhost:8080` through Spring Boot.

Explain that:

- React runs on its own development server, typically something like `http://localhost:5173`.
- Python runs as the backend API server, typically something like `http://localhost:5000` or whatever port the implementation actually uses.

Make the README consistent with the actual project configuration.

### 7. Update the demo script

Keep the same three demo steps, but describe the new architecture:

1. Fill in weight/height/age/gender/goal → click **Calculate BMI** → React sends the data to the Python backend → backend calculates BMI and returns the BMI value + category.
2. Type a question such as `"What should I eat to build muscle?"` → click **Ask AI** → React sends the request to the Python backend → Python sends the context to Gemini → response is displayed in React.
3. Demonstrate error handling using invalid input such as negative weight or by testing an unavailable Gemini/API connection.

### 8. Update "How this maps to the paper"

Keep the existing table and its meaning, but replace the technology-specific implementation details.

It should approximately map as:

| Paper (Fig. 2 / Sec. IV) | This project |
|---|---|
| User Inputs (Weight, Height, Age, Gender) | React form |
| BMI Calculation Branch | Python backend `/api/bmi` |
| Classify BMI | Python BMI calculation logic |
| Query Processing Branch → OpenAI GPT-4 | Python backend `/api/advice` → Google Gemini |
| Error Handling | Python backend API error handling + React validation |
| Frontend (chat interface, BMI calculator) | React.js |
| Backend (Node.js/Express in paper) | Python backend |

Do not reintroduce Java anywhere in this section.

### 9. Update the project structure

Replace the old Maven/Java structure with a React + Python structure.

Use an appropriate structure such as:

```text
fitmate-lite/
├── README.md
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── ...
└── backend/
    ├── app.py
    ├── requirements.txt
    ├── .env
    └── ...
```

If the actual project structure differs, document the actual structure instead of inventing files.

### 10. Update the "What's intentionally left out" section

Keep the existing limitations:

- No database / stored history
- No user auth
- No wearable device integration
- Single AI model call with no conversation memory

### 11. Preserve the original paper reference

Keep the reference to:

> "FitMate AI-Powered Fitness Companion", Patidar et al., IEEE ICTBIG 2024

### 12. Final consistency check

After editing the README, make sure:

- The word `Java` does not appear anywhere.
- `Spring Boot` does not appear anywhere.
- `Maven` does not appear anywhere.
- There are no Java file references such as `.java`.
- All commands correspond to React + Python.
- The README describes a React frontend and Python backend consistently.
- The functionality and scope of the original FitMate Lite project remain unchanged.

Do not rewrite the project into a different application. This is a technology-stack migration of the existing FitMate Lite project from Java/Spring Boot to React + Python.
