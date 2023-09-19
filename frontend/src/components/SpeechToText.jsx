// import React, { useEffect } from 'react';
// import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


// // const appId = '67912827-d6a0-4329-ace1-99eb1f1052ac';
// const appId = process.env.REACT_APP_SPEECHLY_ID;
// const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
// SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

// const SpeechToText = () => {
//   const {
//     transcript,
//     listening,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition();
//   const startListening = () => SpeechRecognition.startListening({ continuous: true });

//   useEffect(() => {
//     startListening();
//     return () => {
//       SpeechRecognition.stopListening();
//     }
//   }, []);

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }
//   else {

//     return (
//       <div className="w-[800px] h-[200px] bg-red-300">
//         {/* <p>Microphone: {listening ? 'on' : 'off'}</p> */}
//         {/* <button */}
//         {/*   onTouchStart={startListening} */}
//         {/*   onMouseDown={startListening} */}
//         {/*   onTouchEnd={SpeechRecognition.stopListening} */}
//         {/*   onMouseUp={SpeechRecognition.stopListening} */}
//         {/* >Hold to talk</button> */}
//         <p>{transcript}</p>
//       </div>
//     );
//   };
// }
// export default SpeechToText;



import React, { useEffect, useState, useRef } from "react";
import * as io from "socket.io-client";

const sampleRate = 16000;

const getMediaStream = () =>
  navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: "default",
      sampleRate: sampleRate,
      sampleSize: 16,
      channelCount: 1,
    },
    video: false,
  });

const SpeechToText = () => {
  const [connection, setConnection] = useState();
  const [currentRecognition, setCurrentRecognition] = useState();
  const [recognitionHistory, setRecognitionHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState();
  const processorRef = useRef();
  const audioContextRef = useRef();
  const audioInputRef = useRef();

  const speechRecognized = (data) => {
    if (data.isFinal) {
      setCurrentRecognition("...");
      // setRecognitionHistory((old) => [data.text, ...old]);
      setRecognitionHistory((old) => [...old, data.text]);
    } else setCurrentRecognition(data.text + "...");
  };

  useEffect(() => {
    console.log("\n\nrecognitionHistory", recognitionHistory);
  }, [recognitionHistory]);

  const connect = () => {
    connection?.disconnect();
    const socket = io.connect("http://localhost:8081");
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setConnection(socket);
    });

    socket.emit("send_message", "hello world");

    socket.emit("startGoogleCloudStream");

    socket.on("receive_message", (data) => {
      console.log("received message", data);
    });

    socket.on("receive_audio_text", (data) => {
      speechRecognized(data);
      console.log("received audio text", data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected", socket.id);
    });
  };

  const disconnect = () => {
    if (!connection) return;
    connection?.emit("endGoogleCloudStream");
    connection?.disconnect();
    processorRef.current?.disconnect();
    audioInputRef.current?.disconnect();
    audioContextRef.current?.close();
    setConnection(undefined);
    setRecorder(undefined);
    setIsRecording(false);
    setCurrentRecognition("");
    setRecognitionHistory([]);
  };

  useEffect(() => {
    (async () => {
      if (connection) {
        if (isRecording) {
          return;
        }

        const stream = await getMediaStream();

        audioContextRef.current = new window.AudioContext();

        await audioContextRef.current.audioWorklet.addModule(
          "/src/worklets/recorderWorkletProcessor.js"
        );

        audioContextRef.current.resume();

        audioInputRef.current =
          audioContextRef.current.createMediaStreamSource(stream);

        processorRef.current = new AudioWorkletNode(
          audioContextRef.current,
          "recorder.worklet"
        );

        processorRef.current.connect(audioContextRef.current.destination);
        audioContextRef.current.resume();

        audioInputRef.current.connect(processorRef.current);

        processorRef.current.port.onmessage = (event) => {
          const audioData = event.data;
          connection.emit("send_audio_data", { audio: audioData });
        };
        setIsRecording(true);
      } else {
        console.error("No connection");
      }
    })();
    return () => {
      if (isRecording) {
        processorRef.current?.disconnect();
        audioInputRef.current?.disconnect();
        if (audioContextRef.current?.state !== "closed") {
          audioContextRef.current?.close();
        }
      }
    };
  }, [connection, isRecording, recorder]);

  //   return (
  //     <React.Fragment>
  //       <Container className="py-5 text-center">
  //         <Container fluid className="py-5 bg-primary text-light text-center ">
  //           <Container>
  //             <Button
  //               className={isRecording ? "btn-danger" : "btn-outline-light"}
  //               onClick={connect}
  //               disabled={isRecording}
  //             >
  //               Start
  //             </Button>
  //             <Button
  //               className="btn-outline-light"
  //               onClick={disconnect}
  //               disabled={!isRecording}
  //             >
  //               Stop
  //             </Button>
  //           </Container>
  //         </Container>
  //         <Container className="py-5 text-center">
  //           {recognitionHistory.map((tx, idx) => (
  //             <p key={idx}>{tx}</p>
  //           ))}
  //           <p>{currentRecognition}</p>
  //         </Container>
  //       </Container>
  //     </React.Fragment>
  //   );
  // };


  return (
    <div className="py-5 text-center">
      <div className="py-5 bg-primary text-light text-center">
        <div className="space-x-4">
          <button
            className={`${isRecording ? "bg-red-500" : "bg-white text-primary border border-light"
              } px-4 py-2 rounded`}
            onClick={connect}
            disabled={isRecording}
          >
            Start
          </button>
          <button
            className={`bg-white text-primary border border-light px-4 py-2 rounded`}
            onClick={disconnect}
            disabled={!isRecording}
          >
            Stop
          </button>
        </div>
      </div>
      <div className="py-5 text-center">
        {recognitionHistory.map((tx, idx) => (
          <p key={idx}>{tx}</p>
        ))}
        <p>{currentRecognition}</p>
      </div>
    </div>
  );
}
export default SpeechToText;
