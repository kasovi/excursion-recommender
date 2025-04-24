from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Initialize Flask app
app = Flask(__name__)
cors = CORS(app, origins="*")

# Load environment variables
load_dotenv()

# Register blueprints
from routes import recommendations_bp, test_bp
app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
app.register_blueprint(test_bp, url_prefix='/api/test')

if __name__ == '__main__':
    app.run(debug=True, port=8080)