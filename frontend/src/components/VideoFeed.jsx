import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

function VideoFeed() {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);

  const streamCamVideo = () => {
    const constraints = { audio: true, video: { width: 1920, height: 1080 } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.removeAttribute("controls");
        videoRef.current.onloadedmetadata = (e) => {
          videoRef.current.play();
        };
        setMediaStream(stream);
      })
      .catch((err) => {
        console.log(err.name + ": " + err.message);
      });
  };

  const stopCamVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const playCamVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const endCamVideo = () => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    // Perform any additional setup or side effects here
    return () => {
      // Cleanup or remove any event listeners if needed
    };
  }, []);

  return (
    <div>
      <div id="container">
        <video autoPlay={true} ref={videoRef}></video>
      </div>
      <br />
      <button onClick={streamCamVideo}>Start streaming</button>
      <button onClick={stopCamVideo}>Pause streaming</button>
      <button onClick={playCamVideo}>Continue streaming</button>
      <button onClick={endCamVideo}>End streaming</button>
    </div>
  );
};

export default VideoFeed;

