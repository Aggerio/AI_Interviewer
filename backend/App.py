from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app)

@app.route("/offer", methods=["POST"])
def offer():
    data = request.json
    # Process the offer data and create an answer
    # Send the answer back to the React component
    print(f"received: {data}")
    answer_data = "YUPPP"
    return jsonify(answer_data)

@app.route("/answer", methods=["POST"])
def answer():
    data = request.json
    # Process the answer from the React component
    # Establish the WebRTC connection
    return "OK"



@socketio.on('connect')
def handle():
    print("Connected")

if __name__ == "__main__":
    # app.run(host="localhost", port=5000)
    socketio.run(app, port=5000)

