// import React, { useState, useRef, useEffect } from "react";
// import { io } from "socket.io-client";

// const VideoFeed = () => {
//   const videoRef = useRef(null);
//   const [mediaStream, setMediaStream] = useState(null);


//   function removeAudioFromStream(originalStream) {
//     const videoTracks = originalStream.getVideoTracks();

//     // Create a new MediaStream with only video tracks
//     const videoOnlyStream = new MediaStream();
//     videoTracks.forEach((track) => {
//       videoOnlyStream.addTrack(track);
//     });

//     return videoOnlyStream;
//   }

//   const streamCamVideo = () => {
//     const constraints = { audio: true, video: { width: 1920, height: 1080 } };
//     navigator.mediaDevices
//       .getUserMedia(constraints)
//       .then((stream) => {
//         videoRef.current.srcObject = removeAudioFromStream(stream);
//         videoRef.current.removeAttribute("controls");
//         videoRef.current.removeAttribute("audio");
//         videoRef.current.onloadedmetadata = (e) => {
//           videoRef.current.play();
//         };
//         setMediaStream(stream);
//       })
//       .catch((err) => {
//         console.log(err.name + ": " + err.message);
//       });
//   };

//   const stopCamVideo = () => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//     }
//   };

//   const playCamVideo = () => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//   };

//   const endCamVideo = () => {
//     if (mediaStream) {
//       const tracks = mediaStream.getTracks();
//       tracks.forEach((track) => {
//         track.stop();
//       });
//       videoRef.current.srcObject = null;
//     }
//   };

//   useEffect(() => {
//     // Perform any additional setup or side effects here
//     if (mediaStream != null) {

//       const socket = io("http://127.0.0.1:5000");

//       socket.on("connect", () => {
//         console.log(socket.connected);
//       })

//       socket.on("disconnect", () => {
//         console.log(socket.connected);

//       })

//       var string = "Hello";
//       socket.emit("stream", string);
//       console.log(mediaStream);
//     }
//     return () => {
//       // Cleanup or remove any event listeners if needed
//     };
//   },);

//   return (
//     <div>
//       <div id="container">
//         <video autoPlay={true} ref={videoRef}></video>
//       </div>
//       <br />
//       <button onClick={streamCamVideo}>Start streaming</button>
//       <button onClick={stopCamVideo}>Pause streaming</button>
//       <button onClick={playCamVideo}>Continue streaming</button>
//       <button onClick={endCamVideo}>End streaming</button>
//     </div>
//   );
// };

// export default VideoFeed;


import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

function VideoStreaming() {

  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [socket, setSocket] = useState(io("http://localhost:5000"));
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
        videoRef.current.srcObject = removeAudioFromStream(stream);
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
  function sendVideoFrame() {
    var canvas = document.getElementById("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      socket.emit("video_frame", blob);
    }, "video/webm");
    requestAnimationFrame(sendVideoFrame);
  };
  useEffect(() => {
    // Create a WebSocket connection to the Flask server
    if (mediaStream) {
      // sendVideoFrame();
    }
    return () => {
      // Disconnect from the WebSocket server when unmounting the component
      // if (socket.current) {
      //   socket.current.disconnect();
      // }
    };
  }, []);

  return (
    <div id="container">
      {/* <canvas id="canvas" hidden={true} /> */}
      <video autoPlay={true} ref={videoRef} />
      <button onClick={streamCamVideo} />
    </div>
  );
}

export default VideoStreaming;
