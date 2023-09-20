from flask import Flask, request
from flask_socketio import SocketIO, emit 
import base64
from PIL import Image
import cv2 
import io
from io import StringIO
import numpy as np
import os
import json


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

image_counter = 0

@socketio.on("disconnect")
def append_images_to_vid():
    global image_counter
    #TODO convert all images to a mp4 file with correct predictions
    if not(os.path.isfile('video_received/output.mp4')):
        os.system("ffmpeg -framerate 22 -i image_received/%d.jpg video_received/output.mp4")
    else:
        # TODO figure out how to find the pre existing video width and height
        os.system('ffmpeg -loop 1 -framerate 22 -t 10 -i video_received/output.mp4 \
                  -i "image_received/%d.jpg" \
                   -filter_complex \
                  "[0]scale=432:432,setsar=1[im];[1]scale=432:432,setsar=1[vid];[im][vid]concat=n=2:v=1:a=0" \
                  video_received/out.mp4')         
        pass
    
    # Empty the image received directory and reset global image_counter
    os.system("rm image_received/*")
    image_counter = 0
    pass

@socketio.on('image')
def image(data_image):
    global image_counter
    sbuf = StringIO()
    sbuf.write(data_image)

    # decode and convert into image
    b = io.BytesIO(base64.b64decode(data_image))
    pimg = Image.open(b)

    ## converting RGB to BGR, as opencv standards
    frame = np.array(pimg)

    cv2.imwrite(f"image_received/{image_counter}.jpg", frame)
    image_counter += 1

    # # os.system("ffmpeg -r 1 -i video_received/trial.jpg -vcodec mpeg4 -y video_received/movie.mp4")
    # if os.path.isfile("video_received/movie.mp4"):
    #     video_clip = VideoFileClip("video_received/movie.mp4")
    #     image_clip = ImageClip(frame)
    #     image_duration = 1/22

    #     image_clip = image_clip.set_duration(image_duration)

    #     image_clip = image_clip.resize(height=video_clip.h, width=video_clip.w)

    #     final_clip = clips_array([[video_clip], [image_clip]])

    #     final_clip.write_videofile("output_video.mp4", codec="libx264")
    # else:
    #     def make_blank_frame(t):
    #         return 255 * np.ones((720, 1280, 3), dtype=np.uint8)
    #     blank_clip = VideoClip(make_blank_frame, duration=1)
    #     blank_clip.fps=22

    #     blank_clip.write_videofile("movie.mp4", codec="libx264")

@socketio.on('video_frame')
def save_file(data_image):
    with open("trial.webm", "ab+") as f:
        f.write(data_image)


if __name__ == '__main__':
    socketio.run(app, host='localhost', port=5001, debug=True)
