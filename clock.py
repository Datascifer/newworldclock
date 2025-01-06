from flask import Flask, render_template, request, jsonify
from datetime import datetime
import pytz
import openai
from flask_caching import Cache

# Initialize Flask app
app = Flask(__name__)

# Caching configuration
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 30})

# Set OpenAI API key
openai.api_key = "<YOUR_OPENAI_API_KEY>"

# Home route
@app.route("/")
def index():
    return render_template("index.html")

# Route for fetching time data (with caching)
@app.route("/time", methods=["POST"])
@cache.cached()
def get_time():
    data = request.json
    city = data.get("city")
    timezone = data.get("timezone")

    try:
        local_time = datetime.now(pytz.timezone(timezone)).strftime("%H:%M:%S")
        return jsonify({"time": local_time})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Route for AI assistant
@app.route("/ai", methods=["POST"])
def ai_assistant():
    user_message = request.json.get("message")

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for a world clock app."},
                {"role": "user", "content": user_message},
            ],
        )
        ai_message = response['choices'][0]['message']['content']
        return jsonify({"response": ai_message})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
