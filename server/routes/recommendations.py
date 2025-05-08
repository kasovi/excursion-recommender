from flask import Blueprint, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import os
import requests
import sqlite3

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
        f"{index + 1}. {p['name']} — {', '.join(p.get('types', [])[:3])} — Rating: {p.get('rating', 'N/A')} — {p.get('formatted_address', '')}"
        for index, p in enumerate(top_results)
    ]

    summary_prompt = (
        f"The user is looking for places in {city} based on the following preferences:\n"
        f"Tags: {', '.join(selected_tags)}\n"
        f"Description: \"{paragraph}\"\n\n"
        f"Here is a list of places that match their preferences. For each place, provide a brief summary that explains why it is a good match for the user's preferences. "
        f"Each summary should be concise, friendly, and highlight why the place is worth visiting:\n\n" +
        "\n".join(place_summaries) +
        "\n\nFormat your response as:\n"
        "1. [Place Name]: [Summary]\n"
        "2. [Place Name]: [Summary]\n"
        "3. [Place Name]: [Summary]\n"
        "...\n"
    )

    summary_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You summarize Google Places search results into friendly trip suggestions tailored to user preferences."},
            {"role": "user", "content": summary_prompt}
        ]
    )
    final_summary = summary_response.choices[0].message.content.strip()

    # Generate a title using GPT
    title_prompt = (
        f"Create a short, catchy title for an excursion recommendation based on the following:\n"
        f"Tags: {', '.join(selected_tags)}\n"
        f"Paragraph: \"{paragraph}\"\n"
        f"City: {city}\n\n"
        f"Examples: 'Romantic Seafood Spots', 'Family-Friendly Hiking Trails', 'Luxury Spa Getaways'"
    )

    title_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You create short, catchy titles for excursion recommendations."},
            {"role": "user", "content": title_prompt}
        ]
    )
    title = title_response.choices[0].message.content.strip()

    # Return the title along with the summary and results
    return jsonify({
        "title": title,
        "types": types,
        "keywords": keywords,
        "summary": final_summary,
        "rawResults": top_results
    })

# Save recommendation to the database
@recommendations_bp.route('/save', methods=['POST'])
def save_recommendation():
    data = request.json
    username = data.get('username')
    title = data.get('title')  # Add title
    summary = data.get('summary')
    raw_results = data.get('rawResults')

    if not username or not title or not summary or not raw_results:
        return jsonify({"error": "All fields are required"}), 400

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    try:
        cursor.execute('''
            INSERT INTO recommendations (username, title, summary, raw_results)
            VALUES (?, ?, ?, ?)
        ''', (username, title, summary, str(raw_results)))
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"message": "Recommendation saved successfully"}), 201

# Get saved recommendations for a user
@recommendations_bp.route('/library', methods=['GET'])
def get_saved_recommendations():
    username = request.args.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT summary, raw_results FROM recommendations WHERE username = ?', (username,))
        rows = cursor.fetchall()
        recommendations = [
            {"summary": row[0], "rawResults": eval(row[1])} for row in rows
        ]
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify(recommendations), 200
