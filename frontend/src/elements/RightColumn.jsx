import React from 'react';
import Question from '../components/Question';
import SpeechToText from '../components/SpeechToText';

function RightColumn() {
  return (
    <div className="h-screen flex flex-col">
      {/* Div5 - Questions component */}
      <div className="bg-black p-4 flex-grow">
        <Question  /> 
      </div>

      {/* Space between Div5 and Div6 */}
      <div className="my-8"></div>

      {/* Div6 - Transcription component */}
      <div className="bg-black p-3 border-2 border-x-fuchsia-600 rounded">
        < SpeechToText/>
      </div>
    </div>
  );
}

export default RightColumn;
