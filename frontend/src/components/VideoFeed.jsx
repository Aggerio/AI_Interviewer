import React from "react";

class VideoFeed extends React.Component {
  constructor(props) {
    super(props);
    this.streamCamVideo = this.streamCamVideo.bind(this)
  }
  streamCamVideo() {
    var constraints = { audio: true, video: { width: 1920, height: 1080 } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(mediaStream) {
        // var video = document.querySelector("video");
        var video = document.getElementById("videoElement")

        video.srcObject = mediaStream;
        video.removeAttribute("controls");
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      }); // always check for errors at the end.
  }
  stopCamVideo() {
    var video = document.getElementById("videoElement");
    video.pause();
  }
  playCamVideo() {
    var video = document.getElementById("videoElement");
    video.play();
  }
  EndCamVideo() {
    var videoEl = document.getElementById('videoElement');
    var stream = videoEl.srcObject;
    var tracks = stream.getTracks();
    tracks.forEach(function(track) {
      // stopping every track
      track.stop();
    });
    videoEl.srcObject = null;
  }
  render() {
    return (
      <div>
        <div id="container">
          <video autoPlay={true} id="videoElement" ></video>
        </div>
        <br />
        <button onClick={this.streamCamVideo}>Start streaming</button>
        <button onClick={this.stopCamVideo}>Pause streaming</button>
        <button onClick={this.playCamVideo}>Continue streaming</button>
        <button onClick={this.EndCamVideo}>End streaming</button>
      </div>
    );
  }
}

export default VideoFeed;
