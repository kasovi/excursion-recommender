from flask import Blueprint, jsonify

# Create a Blueprint for test
test_bp = Blueprint('test', __name__)

@test_bp.route('/', methods=['GET'])
def test():
    return jsonify({"message": "Server is running!"})