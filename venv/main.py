from flask import Flask, request, jsonify, session
from flask_cors import CORS
from agents import DestinationAgent
import os


app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-2023')  # Add session support
CORS(app)

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

# Add session initialization middleware
@app.before_request
def make_session_permanent():
    session.permanent = True
    session.setdefault('history', [])

# Modified endpoint with conversation tracking
@app.route('/api/destination', methods=['POST'])
def destination_endpoint():
    data = request.json
    message = data.get('message', '')
    
    # Retrieve and manage conversation history
    history = session['history'][-4:]  # Keep last 4 exchanges
    
    # Query rewriting for follow-ups
    standalone_query = make_standalone_query(message, history)
    
    # Existing processing logic
    if any(k in message.lower() for k in ['culture', 'food', 'nature']):
        response = destination_agent.greet(interest_type)
    else:
        destination = extract_destination(message)
        pdf_context = destination_agent.query_pdf(destination, history)
        response = generate_response(pdf_context, history, standalone_query)
    
    # Update session history
    session['history'].append({"user": message, "bot": response})
    session.modified = True
    
    return jsonify({'response': response})

def make_standalone_query(current_query, history):
    if not history or not is_followup(current_query):
        return current_query
        
    prompt = f"""Rewrite this follow-up question using context from previous questions:
    Chat History: {history}
    Follow-up: {current_query}
    Standalone question:"""
    
    return destination_agent.get_response(prompt)
'''
@app.route('/api/destination', methods=['POST'])
def destination_endpoint():


    data = request.json
    message = data.get('message', '')
    
    interest_type = None
    if any(k in message.lower() for k in ['culture', 'history', 'art']):
        interest_type = 'culture'
    elif any(k in message.lower() for k in ['food', 'eat']):
        interest_type = 'food'
    elif any(k in message.lower() for k in ['nature', 'hiking', 'green']):
        interest_type = 'nature'
    
    if interest_type:
        response = destination_agent.greet(interest_type)
    elif 'tell me about' in message.lower() or 'interested in' in message.lower():
        destination = message.replace('interested in', '').replace('tell me about', '').strip()
        response = destination_agent.get_destination_insights(destination)
    else:
        destination = message
        response = destination_agent.get_destination_insights(destination)

    #if hasattr(response, 'content'):
    #    formatted_response = response.content
    #else:
    #    formatted_response = str(response)

    return jsonify({'response': response})
'''

if __name__ == "__main__":
    app.run(port=5002)