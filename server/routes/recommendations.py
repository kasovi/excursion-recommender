from flask import Blueprint, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import os
import requests
import sqlite3
import json

# Create flask blueprint and enable CORS
recommendations_bp = Blueprint('recommendations', __name__)
# Enable Cross-Origin Resource Sharing for this blueprint
CORS(recommendations_bp)

# Load API keys from environment variables (must be stored in .env file in server directory)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
# Initialize OpenAI client with API key
client = OpenAI(api_key=OPENAI_API_KEY)


@recommendations_bp.route('/', methods=['POST'])
def recommendations():
    # Parse JSON data from the incoming POST request
    data = request.json
    selected_tags = data.get('selectedTags', [])
    paragraph = data.get('paragraph', '')
    city = data.get('city', '')

    # Check for required APIU keys and city input, return errors if missing
    if not OPENAI_API_KEY or not GOOGLE_PLACES_API_KEY:
        return jsonify({"error": "API keys missing."}), 500
    if not city:
        return jsonify({"error": "City is required."}), 400

    # GPT to classify user imput and generate structured type and keyword suggestions
    classification_prompt = (
        f"Analyze the following tags: {selected_tags}, and paragraph: \"{paragraph}\". "
        f"Return a JSON object with two fields:\n"
        f"1. 'types': a list of suitable Google Places types (e.g., 'museum', 'hiking_trail', 'spa')\n"
        f"2. 'keywords': a list of 2–4 refined keywords to enhance search relevance (e.g., 'sunset view', 'waterfall')\n\n"
        f"User is visiting: {city}."
    )

    # Send prompt to GPT-4 for classification
    classify_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You help categorize excursion requests into Google Places types and keywords."},
            {"role": "user", "content": classification_prompt}
        ]
    )

    # Get the GPT output as a string
    parsed_output = classify_response.choices[0].message.content.strip()
    try:
        # Parse the output (shold be a JSON object with 'types' and 'keywords')
        parsed_json = eval(parsed_output)
        types = parsed_json.get('types', [])
        keywords = parsed_json.get('keywords', [])
    except:
        # Handle parsing errors
        return jsonify({"error": "Failed to parse GPT output."}), 500

    # Query Google Places API for each type and keyword combination
    query_results = []
    for place_type in types:
        for keyword in keywords:
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
            params = {
                "query": f"{keyword} in {city}",
                "type": place_type,
                "key": GOOGLE_PLACES_API_KEY
            }
            # Make the API request
            r = requests.get(url, params=params)
            # Extract results field from the response
            results = r.json().get("results", [])
            # Append results to the query_results list
            query_results.extend(results)

    # Deduplicate by place_id
    seen = set()
    deduped = []
    for place in query_results:
        pid = place.get("place_id")
        if pid and pid not in seen:
            deduped.append(place)
            seen.add(pid)

    # Limit to top 5 unique results
    top_results = deduped[:5]

    # If no results found, return an error
    if not top_results:
        return jsonify({"error": "No places found for your query."}), 404

    # Format each place as a summary string for GPT
    place_summaries = [
        f"{index + 1}. {p['name']} — {', '.join(p.get('types', [])[:3])} — Rating: {p.get('rating', 'N/A')} — {p.get('formatted_address', '')}"
        for index, p in enumerate(top_results)
    ]

    # Prompt gpt to summariez the results in a user-friendly and consistent way
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

    # Send the summary prompt to GPT
    summary_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You summarize Google Places search results into friendly trip suggestions tailored to user preferences."},
            {"role": "user", "content": summary_prompt}
        ]
    )
    # Get the summary response text
    final_summary = summary_response.choices[0].message.content.strip()

    # Prompt to generate a relevant title using GPT
    title_prompt = (
        f"Create one short, catchy title for an excursion recommendation based on the following:\n"
        f"Tags: {', '.join(selected_tags)}\n"
        f"Paragraph: \"{paragraph}\"\n"
        f"City: {city}\n\n"
        f"Examples: 'Romantic Seafood Spots', 'Family-Friendly Hiking Trails', 'Luxury Spa Getaways'"
    )

    # Send the title prompt to GPT
    title_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You create short, catchy titles for excursion recommendations."},
            {"role": "user", "content": title_prompt}
        ]
    )
    # Get the title response text
    title = title_response.choices[0].message.content.strip()

    # Return the title, types, keywords, summary, and raw results as JSON
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
    # Parse JSON data from the incoming POST request
    data = request.json
    username = data.get('username')
    title = data.get('title')  # Add title
    summary = data.get('summary')
    raw_results = data.get('rawResults')

    # Check that all required fields are present
    if not username or not title or not summary or not raw_results:
        return jsonify({"error": "All fields are required"}), 400

    # Connect to the SQLite database
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    try:
        # Insert the recommendation into the recommendations table
        cursor.execute('''
            INSERT INTO recommendations (username, title, summary, raw_results)
            VALUES (?, ?, ?, ?)
        ''', (username, title, summary, str(raw_results)))
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close() # Always close the connection

    return jsonify({"message": "Recommendation saved successfully"}), 201

# Get saved recommendations for a user
@recommendations_bp.route('/library', methods=['GET'])
def get_saved_recommendations():
    # Get the username from the request arguments
    username = request.args.get('username')

    # Check that the username is provided
    if not username:
        return jsonify({"error": "Username is required"}), 400

    # Connect to the SQLite database
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT title, summary, raw_results FROM recommendations WHERE username = ?', (username,))
        rows = cursor.fetchall()
        # Convert each row to a dictionary, eval used to convert back to list/dict
        recommendations = [
            {"title": row[0], "summary": row[1], "rawResults": eval(row[2])} for row in rows
        ]
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify(recommendations), 200

# Delete a specific recommendation for a user
@recommendations_bp.route('/library/delete', methods=['DELETE'])
def delete_recommendation():
    # Parse JSON data from the incoming DELETE request
    data = request.json
    username = data.get('username')
    title = data.get('title')

    if not username or not title:
        return jsonify({"error": "Username and title are required"}), 400

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    try:
        # Delete the recommendation with the given username and title
        cursor.execute('DELETE FROM recommendations WHERE username = ? AND title = ?', (username, title))
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"message": "Recommendation deleted successfully"}), 200

# Save a new itinerary for a user
@recommendations_bp.route('/itineraries/save', methods=['POST'])
def save_itinerary():
    data = request.json
    username = data.get('username')
    title = data.get('title')
    locations = data.get('locations')  # List of selected locations

    if not username or not title or not locations:
        return jsonify({"error": "All fields are required"}), 400

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    try:
        # Insert the itinerary into the itineraries table
        cursor.execute('''
            INSERT INTO itineraries (username, title, locations)
            VALUES (?, ?, ?)
        ''', (username, title, json.dumps(locations)))
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"message": "Itinerary saved successfully"}), 201

# Retrieve saved itineraries for a user
@recommendations_bp.route('/itineraries', methods=['GET'])
def get_itineraries():
    # Get the username from the request arguments
    username = request.args.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    try:
        # Select all itineraries for the given username
        cursor.execute('SELECT id, title, locations FROM itineraries WHERE username = ?', (username,))
        rows = cursor.fetchall()
        # Convert each row to a dictionary, parse locations from JSON string
        itineraries = [
            {"id": row[0], "title": row[1], "locations": json.loads(row[2])} for row in rows
        ]
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify(itineraries), 200

# Delete an itinerary for a user
@recommendations_bp.route('/itineraries/delete', methods=['DELETE'])
def delete_itinerary():
    data = request.json
    username = data.get('username')
    title = data.get('title')

    if not username or not title:
        return jsonify({"error": "Username and title are required"}), 400

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    try:
        # Delete the itinerary with the given username and title
        cursor.execute('DELETE FROM itineraries WHERE username = ? AND title = ?', (username, title))
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"message": "Itinerary deleted successfully"}), 200
