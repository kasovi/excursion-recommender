from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes and allow requests from the frontend
CORS(app, origins=["http://localhost:5173"], methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

# Load environment variables
load_dotenv()

# Register blueprints
from routes.location import location_bp
from routes.recommendations import recommendations_bp
from routes.auth import auth_bp

app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(location_bp, url_prefix='/api/location')

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='localhost')