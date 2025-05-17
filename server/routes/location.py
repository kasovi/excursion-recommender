from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Create Flask Blueprint for location-related routes
location_bp = Blueprint('location', __name__)

# Load Maps API key from environment variables
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")

@location_bp.route('/reverse-geocode', methods=['GET'])
def reverse_geocode():
    # Get latitude and longitude from query parameters
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    # Check that both latitude and longitude are provided
    if not latitude or not longitude:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    try:
        # Build the Google Geocoding API URL with the provided coordinates
        url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={GOOGLE_MAPS_API_KEY}"
        # Make a GET request to the Google Geocoding API
        response = requests.get(url)
        # Parse the JSON response
        response_data = response.json()

        # Check if the API response is OK and contains results
        if response_data.get('status') == 'OK' and response_data.get('results'):
            # Try to extract the city name from the address components
            city_name = next(
                (component['long_name'] for component in response_data['results'][0]['address_components']
                 if 'locality' in component['types']),
                None
            )
            if city_name:
                # Return the city name if found
                return jsonify({"city": city_name}), 200
            else:
                # Return an error if city is not found in the response
                return jsonify({"error": "City not found in the location data"}), 404
        else:
            # Return an error if the API call failed or returned no results
            return jsonify({"error": "Failed to fetch location data"}), 500
    except Exception as e:
        # Return an error if an exception occurred during the process
        return jsonify({"error": str(e)}), 500