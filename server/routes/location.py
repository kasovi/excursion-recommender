from flask import Blueprint, request, jsonify
import requests
import os

location_bp = Blueprint('location', __name__)

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")

@location_bp.route('/reverse-geocode', methods=['GET'])
def reverse_geocode():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    if not latitude or not longitude:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    try:
        url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={GOOGLE_PLACES_API_KEY}"
        response = requests.get(url)
        response_data = response.json()

        if response_data.get('status') == 'OK' and response_data.get('results'):
            city_name = next(
                (component['long_name'] for component in response_data['results'][0]['address_components']
                 if 'locality' in component['types']),
                None
            )
            if city_name:
                return jsonify({"city": city_name}), 200
            else:
                return jsonify({"error": "City not found in the location data"}), 404
        else:
            return jsonify({"error": "Failed to fetch location data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500