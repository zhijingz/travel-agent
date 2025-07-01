from flask import Flask, request, jsonify, session
from flask_cors import CORS
from agents import DestinationAgent, ItineraryAgent
import os
import re

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-2023')
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


pdf_path = "agents/data/"
destination_agent = DestinationAgent(pdf_path=pdf_path)

@app.route('/static/images/default_avatar.png')
@app.route('/static/images/default_project.jpg')
def block_default_images():
    response = app.make_response(
        b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
    response.headers['Content-Type'] = 'image/gif'
    response.headers['Cache-Control'] = 'public, max-age=31536000'
    response.headers['Expires'] = 'Thu, 31 Dec 2037 23:59:59 GMT'
    return response

@app.before_request
def make_session_permanent():
    session.permanent = True
    session.setdefault('history', [])

@app.route('/api/destination', methods=['POST'])
def destination_endpoint():
    data = request.json
    message = data.get('message', '')
    history = session['history'][-4:]
    
    # Determine interest type
    interest_type = None
    if any(k in message.lower() for k in ['culture', 'history', 'art']):
        interest_type = 'culture'
    elif any(k in message.lower() for k in ['food', 'eat']):
        interest_type = 'food'
    elif any(k in message.lower() for k in ['nature', 'hiking', 'green']):
        interest_type = 'nature'
    
    if interest_type:
        response = destination_agent.greet(interest_type)
    else:
        destination = destination_agent.extract_destination(message)
        response = destination_agent.get_destination_insights(
            destination=destination,
            history=history,
            query=message
        )
    
    session['history'].append({"user": message, "bot": response})
    session.modified = True
    return jsonify({'response': response})

# Initialize after other agents
itinerary_agent = ItineraryAgent()

# Add new endpoint
@app.route('/api/itinerary', methods=['POST'])
def itinerary_endpoint():
    data = request.json
    try:
        result = itinerary_agent.plan_trip(
            from_city=data['origin'],
            destination_city=data['destination'],
            interests=data['interests'],
            date_from=data['date_from'],
            date_to=data['date_to']
        )
        return jsonify({'itinerary': result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5002, debug=True)
