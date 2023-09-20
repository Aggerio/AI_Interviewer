import React from 'react';
import ImageAnimated from '../components/ImageAnimated';
import VideoStreaming from '../components/VideoStreaming';

function LeftColumn() {
  return (
    <div className="h-screen flex flex-col justify-between ">
      {/* Div2 - Video component */}
      <VideoStreaming />
      <div className="my-8"></div>
      {/* Div3 - Image with animated border */}
      <ImageAnimated />
    </div>
  );
}
export default LeftColumn;
