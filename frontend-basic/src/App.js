import './App.css';
import VideoStreaming from './components/VideoStreaming';
import ChatGpt from './components/ChatGpt';
import SpeechToText from './components/SpeechToText';
import Question from './components/Question';
import CodeEditor from './components/Editor';
import Stage2 from './pages/Stage2';

function App() {

  return (
    <div className="App">
      {/* <VideoStreaming /> */}
      <ChatGpt />
      <SpeechToText />
      {/* <CodeEditor /> */}
      {/* <Stage2 /> */}
      {/* <Question /> */}
    </div>
  );
}

export default App;
