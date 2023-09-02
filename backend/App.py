from flask import Flask, render_template
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
cors = CORS(app,resources={r"/*":{"origins":"*"}})
# socketio = SocketIO(app, async_mode="eventlet" )

socketio = SocketIO(app, cors_allowed_origins="*")

@cross_origin
@app.route("/")
def index():
    return render_template("index.html")


@cross_origin
@socketio.on("join_room")
def handle_join_room(data):
    room = data["room"]
    join_room(room)
    print(f"User joined room: {room}")


@cross_origin
@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

if __name__ == "__main__":
    socketio.run(app, host="localhost", port=5000)

