from flask import Blueprint, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import os
import requests

# Create a Blueprint for recommendations
recommendations_bp = Blueprint('recommendations', __name__)
CORS(recommendations_bp)  # Enable CORS for this Blueprint

# Load API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

@recommendations_bp.route('/', methods=['POST'])
def recommendations():
    print("Received request for recommendations", request.json)
    data = request.json
    selected_tags = data.get('selectedTags', [])
    paragraph = data.get('paragraph', '')
    city = data.get('city', '')  # New field for city input

    if not OPENAI_API_KEY:
        return jsonify({"error": "OpenAI API key is not set."}), 500
    if not GOOGLE_PLACES_API_KEY:
        return jsonify({"error": "Google Places API key is not set."}), 500
    if not city:
        return jsonify({"error": "City name is required."}), 400  # Check for city input

    # Step 1: Generate Google Places API query using OpenAI
    query_prompt = (
        f"You are planning a personalized outing using Google Places. Given these tags: {selected_tags} "
        f"and this paragraph describing the user's ideal excursion: \"{paragraph}\", "
        f"and the city {city}, generate a concise Google Places API query string "
        f"that includes a real location in the United States (e.g., San Francisco, New York City, etc.), "
        f"suitable for the Google Places Text Search API."
    )

    chat_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates Google Places API queries based on user input."},
            {"role": "user", "content": query_prompt}
        ]
    )
    places_query = chat_response.choices[0].message.content.strip()

    # Step 2: Use the Google Places API
    places_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": places_query,
        "key": GOOGLE_PLACES_API_KEY
    }
    places_response = requests.get(places_url, params=params)
    places_data = places_response.json()

    if 'results' not in places_data or len(places_data['results']) == 0:
        return jsonify({"error": "No results found for the query."}), 404  # Error if no results are found

    # Step 3: Summarize results using OpenAI
    top_results = places_data.get('results', [])[:5]  # Get top 5 results
    summary_prompt = f"Summarize and recommend from these places for an ideal excursion:\n{top_results}"

    summary_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a travel assistant summarizing Google Places results into friendly suggestions."},
            {"role": "user", "content": summary_prompt}
        ]
    )
    final_summary = summary_response.choices[0].message.content.strip()

    return jsonify({
        "query": places_query,
        "summary": final_summary,
        "rawResults": top_results
    })
