import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for the React frontend
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def calculate_bmi_value(weight_kg, height_cm):
    height_m = height_cm / 100
    bmi = weight_kg / (height_m ** 2)
    return round(bmi, 1)

def get_bmi_category(bmi):
    if bmi < 18.5:
        return "Underweight"
    elif 18.5 <= bmi <= 24.9:
        return "Normal"
    elif 25.0 <= bmi <= 29.9:
        return "Overweight"
    else:
        return "Obese"

@app.route('/api/bmi', methods=['POST'])
def calculate_bmi():
    try:
        data = request.get_json()
        weight = float(data.get('weight'))
        height = float(data.get('height'))
        age = int(data.get('age'))
        gender = data.get('gender')
        goal = data.get('goal')

        if weight <= 0 or height <= 0 or age <= 0:
            return jsonify({"error": "Weight, height, and age must be positive values."}), 400

        bmi = calculate_bmi_value(weight, height)
        category = get_bmi_category(bmi)

        return jsonify({
            "bmi": bmi,
            "category": category,
            "weight": weight,
            "height": height,
            "age": age,
            "gender": gender,
            "goal": goal
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/advice', methods=['POST'])
def get_advice():
    if not GEMINI_API_KEY:
        return jsonify({"error": "Gemini API Key is not configured."}), 500

    try:
        data = request.get_json()
        question = data.get('question')
        bmi_category = data.get('bmi_category')
        goal = data.get('goal')

        if not question or not bmi_category or not goal:
            return jsonify({"error": "Missing required fields: question, bmi_category, or goal."}), 400

        # Construct the prompt for Gemini
        prompt = f"""
        You are FitMate, an AI fitness companion. 
        A user has asked the following question: "{question}"
        
        Context about the user:
        - BMI Category: {bmi_category}
        - Fitness Goal: {goal}
        
        Provide personalized, encouraging, and safe fitness and dietary advice based on this context. 
        Keep the response concise and formatted cleanly using markdown.
        """

        # Generate response using the gemini-3.6-flash model with streaming
        model = genai.GenerativeModel('gemini-3.6-flash')
        response = model.generate_content(prompt, stream=True)

        def generate():
            try:
                for chunk in response:
                    try:
                        if chunk.text:
                            yield chunk.text
                    except ValueError:
                        # If a chunk throws a ValueError (e.g., due to safety settings), ignore it
                        pass
            except Exception as e:
                yield f"\n\n[Stream Interrupted: {str(e)}]"

        return app.response_class(generate(), mimetype='text/plain')

    except Exception as e:
        return jsonify({"error": f"Failed to fetch advice from AI: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
