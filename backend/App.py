# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_socketio import SocketIO

# app = Flask(__name__)
# cors = CORS(app)
# socketio = SocketIO(app, cors_allowed_origins='*')

# @app.route("/offer", methods=["POST"])
# def offer():
#     data = request.json
#     # Process the offer data and create an answer
#     # Send the answer back to the React component
#     print(f"received: {data}")
#     answer_data = "YUPPP"
#     return jsonify(answer_data)

# @app.route("/answer", methods=["POST"])
# def answer():
#     data = request.json
#     return "OK"

# @socketio.on('stream')
# def handle(data):
#     print(f"Connected and got data\n\n {data}")

# if __name__ == "__main__":
#     # app.run(host="localhost", port=5000)
#     socketio.run(app, port=5000)



from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS
import cv2

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

@socketio.on("video_frame")
def handle_video_frame(frame_blob):
    # Handle the received video frame blob (e.g., save it to disk, process it)
    print(f"received: {frame_blob}")

    with open("received_frame.webm", "wb") as f:
        f.write(frame_blob)

if __name__ == "__main__":
    socketio.run(app, host="localhost", port=5000)
