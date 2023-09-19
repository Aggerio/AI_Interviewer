import { type } from "@testing-library/user-event/dist/type";
import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const VideoFeed = () => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const recordedChunksRef = useRef([]);
  const socket = useRef();
  const connected = useRef(false);


  function removeAudioFromStream(originalStream) {
    const videoTracks = originalStream.getVideoTracks();

    // Create a new MediaStream with only video tracks
    const videoOnlyStream = new MediaStream();
    videoTracks.forEach((track) => {
      videoOnlyStream.addTrack(track);
    });

    return videoOnlyStream;
  }

  const streamCamVideo = () => {
    const constraints = { audio: true, video: { width: 1920, height: 1080 } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        const options = {
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000,
          mimeType: "video/webm",
        };
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.start(1000); // where 1000 is the interval
        console.log("MediaRecorder: ", mediaRecorder);
        videoRef.current.srcObject = removeAudioFromStream(stream);
        videoRef.current.removeAttribute("controls");
        videoRef.current.removeAttribute("audio");
        videoRef.current.onloadedmetadata = (e) => {
          videoRef.current.play();
        };
        setMediaStream(stream);


        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
            console.log("Emitting blob");
            const blob = new Blob(recordedChunksRef.current, {
              type: "video/webm",
            });

            // Send the blob as a binary message over WebSocket
            socket.current.emit("video_frame", blob);
            recordedChunksRef.current = [];
            // socket.current.emit("video_frame", e.data);
            // recordedChunksRef.current = [];

            // console.log(recordedChunksRef.current.length);
          }
        };
      })
      .catch((err) => {
        console.log(err.name + ": " + err.message);
      });
  };


  //   // Handle data available from MediaRecorder
  //   const handleDataAvailable = (event) => {
  //     console.log("Triggered");
  //     if (e.data.size > 0) {
  //       recordedChunksRef.current.push(e.data);
  //     }
  //   };
  // };
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


  // Send recorded video chunks to the server
  const sendVideoChunks = () => {
    if (recordedChunksRef.current.length > 0) {
      console.log("Emitting blob");
      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      // Send the blob as a binary message over WebSocket
      socket.current.emit("video_frame", blob);
      recordedChunksRef.current = [];
    }
  };

  const endCamVideo = () => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
      socket.current.emit("video_frame", recordedChunksRef.data);
    }
  };

  useEffect(() => {
    // Perform any additional setup or side effects here
    if (connected.current == false) {
      socket.current = io("http://localhost:5000");
      connected.current = true;
    }
    socket.current.on("connect", () => {
      console.log(socket.current.connected);
    })

    socket.current.on("disconnect", () => {
      console.log(socket.current.connected);

    })

    // socket.emit("stream", mediaStream);
    // setInterval(sendVideoChunks, 100);
    // setInterval(sendVideoChunks, 1000);
    return () => {
      // Cleanup or remove any event listeners if needed
      // socket.current.close();
    };
  });

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
