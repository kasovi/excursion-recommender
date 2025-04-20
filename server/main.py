from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins="*")

@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    data = request.json
    selected_tags = data.get('selectedTags', [])
    paragraph = data.get('paragraph', '')

    # For now, just return the received data
    return jsonify({
        "message": "Data received successfully",
        "selectedTags": selected_tags,
        "paragraph": paragraph
    })

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Server is running!"})

if __name__ == '__main__':
    app.run(debug=True, port=8080)