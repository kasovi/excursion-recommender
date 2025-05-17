from flask import Blueprint, request, jsonify
import sqlite3

# Create a Flask Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

# Path to the SQLite database file
DATABASE = 'users.db'

def get_db_connection():
    # Helper function to connect to the SQLite database
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
    return conn

@auth_bp.route('/register', methods=['POST'])
def register():
    # Handle user registration
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check that both username and password are provided
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Attempt to insert the new user into the database
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
    except sqlite3.IntegrityError:
        # If username already exists, return an error
        return jsonify({"error": "Username already exists"}), 400
    finally:
        # Always close the database connection
        conn.close()

    # Return success message if registration is successful
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    # Handle user login
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check that both username and password are provided
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Query the database for the user
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    # Check if user exists and password matches
    if user and user['password'] == password:
        return jsonify({"message": "Login successful"}), 200
    else:
        # Return error if credentials are invalid
        return jsonify({"error": "Invalid credentials"}), 401