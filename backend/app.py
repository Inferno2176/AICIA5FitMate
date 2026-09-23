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

def calculate_bmr(weight, height, age, gender):
    # Mifflin-St Jeor Equation
    base = (10 * weight) + (6.25 * height) - (5 * age)
    if gender == 'Male':
        return round(base + 5)
    else:
        return round(base - 161)

def calculate_tdee(bmr, lifestyle):
    multipliers = {
        'Sedentary': 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725
    }
    # Default to Sedentary if unknown
    multiplier = multipliers.get(lifestyle, 1.2)
    return round(bmr * multiplier)

@app.route('/api/bmi', methods=['POST'])
def calculate_bmi():
    try:
        data = request.get_json()
        weight = float(data.get('weight'))
        height = float(data.get('height'))
        age = int(data.get('age'))
        gender = data.get('gender', 'Male')
        goal = data.get('goal')
        lifestyle = data.get('lifestyle', 'Sedentary')

        if weight <= 0 or height <= 0 or age <= 0:
            return jsonify({"error": "Weight, height, and age must be positive values."}), 400

        bmi = calculate_bmi_value(weight, height)
        category = get_bmi_category(bmi)
        bmr = calculate_bmr(weight, height, age, gender)
        tdee = calculate_tdee(bmr, lifestyle)

        return jsonify({
            "bmi": bmi,
            "category": category,
            "weight": weight,
            "height": height,
            "age": age,
            "gender": gender,
            "goal": goal,
            "bmr": bmr,
            "tdee": tdee
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/advice', methods=['POST'])
def get_advice():
    if not GEMINI_API_KEY:
        return jsonify({"error": "Gemini API Key is not configured."}), 500

    try:
        data = request.get_json()
        advice_type = data.get('advice_type', 'diet')
        question = data.get('question', '')
        
        bmi_category = data.get('bmi_category', 'Unknown')
        goal = data.get('goal', 'General Fitness')
        lifestyle = data.get('lifestyle', 'Unknown')
        diet_pref = data.get('diet_pref', 'No preference')
        diseases = data.get('diseases', [])
        
        disease_str = ", ".join(diseases) if diseases else "None"

        base_context = f"""
        - BMI Category: {bmi_category}
        - Fitness Goal: {goal}
        - Lifestyle: {lifestyle}
        - Dietary Preferences: {diet_pref}
        - Existing Health Conditions: {disease_str}
        """

        if advice_type == 'chat':
            prompt = f"""
            You are StayRight, an expert fitness and nutrition advisor.
            
            Context about the user:
            {base_context}
            
            The user has a specific follow-up question:
            "{question}"
            
            Provide a concise, helpful answer to this question, keeping their specific health conditions and profile in mind.
            Format your response cleanly in markdown. DO NOT USE ANY EMOJIS in your response. Maintain a professional tone.
            """
        elif advice_type == 'workout':
            prompt = f"""
            You are StayRight, an expert fitness and nutrition advisor.
            
            Generate a highly personalized, structured WORKOUT PLAN for a user with the following profile:
            {base_context}
            
            CRITICAL RULES:
            1. If they have Asthma, recommend low-intensity cardio and longer rest periods.
            2. If they have Heart Disease or High Cholesterol, prioritize moderate aerobic exercise and avoid extreme high-intensity intervals initially.
            3. If they have PCOS/PCOD, recommend a mix of strength training and moderate cardio to help with insulin resistance.
            4. Format the plan beautifully using markdown headers (##) and bullet points. 
            5. DO NOT USE ANY EMOJIS in your response. Maintain a strictly professional tone.
            """
        else: # diet
            prompt = f"""
            You are StayRight, an expert fitness and nutrition advisor.
            
            Generate a highly personalized, structured DIET PLAN for a user with the following profile:
            {base_context}
            
            CRITICAL RULES:
            1. If they have Diabetes, strictly limit sugar and simple carbs in the diet.
            2. If they have Heart Disease or High Cholesterol, prioritize heart-healthy fats, low sodium.
            3. If they have PCOS/PCOD, recommend a low glycemic index (GI) diet with high protein to manage insulin.
            4. Respect their dietary preferences (e.g., if Vegan, absolutely no animal products).
            5. Format the plan beautifully using markdown headers (##) and bullet points. 
            6. DO NOT USE ANY EMOJIS in your response. Maintain a strictly professional tone.
            """

        models_to_try = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash']
        response = None
        
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt, stream=True)
                break
            except Exception as e:
                print(f"Model {model_name} failed: {e}")
                continue
                
        if not response:
            return jsonify({"error": "All AI models are currently exhausted or unavailable. Please try again later."}), 503

        def generate():
            try:
                for chunk in response:
                    try:
                        if chunk.text:
                            yield chunk.text
                    except ValueError:
                        pass
            except Exception as e:
                yield f"\n\n[Stream Interrupted: {str(e)}]"

        return app.response_class(generate(), mimetype='text/plain')

    except Exception as e:
        return jsonify({"error": f"Failed to fetch advice from AI: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
