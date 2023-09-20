import React from 'react';
import SpeechToText from '../components/SpeechToText';
import Question from '../components/Question';
import CodeEditor from '../components/Editor';
function App() {
  return (
    <div className="flex h-screen">
      {/* Left Div (div1) */}
      <div className="w-1/2 bg-deep-blue p-8 relative flex flex-col">
        <div className="flex-1">
          {/* Div 4 (Upper Section) */}
          <div className="flex border-b border-gray-400 relative overflow-y-auto w-3/4 h-3/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <SpeechToText />
          </div>
        </div>
        {/* Div 5 (Lower Section) */}
        <div className="h-1/2 relative overflow-y-auto">
          <div className="w-3/4 h-3/4 text-white">
            <Question />
          </div>
        </div>
      </div>

      {/* Right Div (div2) */}
      <div className="w-1/2 bg-gray-800 text-white">
        {/* <p>This is Div 2</p> */}
        <CodeEditor />
      </div>
    </div >
  );
}

export default App;
