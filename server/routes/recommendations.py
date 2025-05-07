from flask import Blueprint, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import os
import requests

# Create Blueprint and CORS
recommendations_bp = Blueprint('recommendations', __name__)
CORS(recommendations_bp)

# API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

@recommendations_bp.route('/', methods=['POST'])
def recommendations():
    data = request.json
    selected_tags = data.get('selectedTags', [])
    paragraph = data.get('paragraph', '')
    city = data.get('city', '')

    if not OPENAI_API_KEY or not GOOGLE_PLACES_API_KEY:
        return jsonify({"error": "API keys missing."}), 500
    if not city:
        return jsonify({"error": "City is required."}), 400

    # GPT to generate structured type and keyword suggestions
    classification_prompt = (
        f"Analyze the following tags: {selected_tags}, and paragraph: \"{paragraph}\". "
        f"Return a JSON object with two fields:\n"
        f"1. 'types': a list of suitable Google Places types (e.g., 'museum', 'hiking_trail', 'spa')\n"
        f"2. 'keywords': a list of 2–4 refined keywords to enhance search relevance (e.g., 'sunset view', 'waterfall')\n\n"
        f"User is visiting: {city}."
    )

    classify_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You help categorize excursion requests into Google Places types and keywords."},
            {"role": "user", "content": classification_prompt}
        ]
    )
    parsed_output = classify_response.choices[0].message.content.strip()
    try:
        parsed_json = eval(parsed_output)
        types = parsed_json.get('types', [])
        keywords = parsed_json.get('keywords', [])
    except:
        return jsonify({"error": "Failed to parse GPT output."}), 500

    # Use type and keyword in structured Google Places queries
    query_results = []
    for place_type in types:
        for keyword in keywords:
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
            params = {
                "query": f"{keyword} in {city}",
                "type": place_type,
                "key": GOOGLE_PLACES_API_KEY
            }
            r = requests.get(url, params=params)
            results = r.json().get("results", [])
            query_results.extend(results)

    # Deduplicate by place_id
    seen = set()
    deduped = []
    for place in query_results:
        pid = place.get("place_id")
        if pid and pid not in seen:
            deduped.append(place)
            seen.add(pid)

    top_results = deduped[:5]

    # Summarize top results with GPT
    place_summaries = [
        f"{p['name']} — {', '.join(p.get('types', [])[:3])} — Rating: {p.get('rating', 'N/A')} — {p.get('formatted_address', '')}"
        for p in top_results
    ]

    summary_prompt = (
        "Summarize and recommend 3 standout places from the following list for a fun excursion:\n\n" +
        "\n".join(place_summaries)
    )

    summary_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You summarize Google Places search results into friendly trip suggestions."},
            {"role": "user", "content": summary_prompt}
        ]
    )
    final_summary = summary_response.choices[0].message.content.strip()

    return jsonify({
        "types": types,
        "keywords": keywords,
        "summary": final_summary,
        "rawResults": top_results
    })
