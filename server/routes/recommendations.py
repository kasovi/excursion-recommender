from flask import Blueprint, jsonify, request
from openai import OpenAI
import os

# Create a Blueprint for recommendations
recommendations_bp = Blueprint('recommendations', __name__)

# Load API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

@recommendations_bp.route('/', methods=['POST'])
def recommendations():
    data = request.json
    selected_tags = data.get('selectedTags', [])
    paragraph = data.get('paragraph', '')

    if not OPENAI_API_KEY:
        return jsonify({"error": "OpenAI API key is not set."}), 500
    if not GOOGLE_PLACES_API_KEY:
        return jsonify({"error": "Google Places API key is not set."}), 500

    query_prompt = f"You are planning a personalized outing. Given the following tags: {selected_tags} and this paragraph from a user describing their ideal excursion: \"{paragraph}\", generate a short but descriptive Google Places API query."
    return jsonify({
        "message": "Data received successfully",
        "selectedTags": selected_tags,
        "paragraph": paragraph,
        "queryPrompt": query_prompt
    })