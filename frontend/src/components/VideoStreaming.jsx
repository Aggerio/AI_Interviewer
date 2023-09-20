import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

function VideoStreaming() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const socket = useRef(null);
  const playing = useRef(false);


  function start() {
    // Access the video element and set its attributes
    const video = videoRef.current;
    video.width = 500;
    video.height = 375;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(function(stream) {
          video.srcObject = stream;
          // video.play();
        })
        .catch(function(error) {
          console.log(error);
          console.log("Something went wrong!");
        });
    }

  }
  useEffect(() => {
    // Create a WebSocket connection to the Flask server
    if (playing.current == false) {
      start();
    }
    socket.current = io("http://localhost:5001");


    // Access the canvas element
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.canvas.hidden = true;

    const FPS = 22;

    const captureAndSendFrame = () => {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL("image/png").split("data:image/png;base64,")[1];
      socket.current.emit("image", data);
    };

    const intervalId = setInterval(captureAndSendFrame, 1000 / FPS);
    // Handle the response image received from the server
    socket.current.on("response_back", (imageData) => {
      const image = imageRef.current;

      // Pause the video before updating the image source
      // videoRef.current.pause();

      image.src = "data:image/png;base64," + imageData;

    });
    return () => {
      // Clean up and stop the interval when unmounting
      clearInterval(intervalId);
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);
  return (
    <div>
      <div id="container">
        <canvas ref={canvasRef} id="canvasOutput"></canvas>
        <video autoPlay={true} ref={videoRef}></video>
      </div>
    </div>
  );
}

export default VideoStreaming;

