import logging
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import worker  # Import the worker module

# Initialize Flask app and CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.logger.setLevel(logging.ERROR)

# Define the route for the index page
@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "running" 
    }), 200

# Define the route for processing messages
@app.route('/process-message', methods=['POST'])
def process_message_route():

    user_message = request.json['userMessage']  # Extract the user's message from the request
    print('user_message', user_message)

    bot_response = worker.process_prompt(user_message)  # Process the user's message using the worker module
    print('bot_message', bot_response)

    # Return the bot's response as JSON
    return jsonify({
        "botResponse": bot_response
    }), 200

# Define the route for processing documents
@app.route('/process-document', methods=['POST'])
def process_document_route():

    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({
            "botResponse": "There was an issue uploading the file"
                           "Please try again or upload another file"
        }), 400

    file = request.files['file']  # Extract the uploaded file from the request

    file_path = file.filename  # Define the path where the file will be saved
    file.save(file_path)  # Save the file

    worker.process_document(file_path)  # Process the document using the worker module

    # Return a success message as JSON
    return jsonify({
        "status": "success"
    }), 200

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=8000, host='0.0.0.0')