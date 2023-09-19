import React from 'react';

function ImageAnimated() {
  return (
    <div className="flex items-center justify-center w-1/2 h-1/4">
      {/* Div1 - Animated Border */}
      <div className="border-4 border-purple-600 animate-pulse absolute top-0 right-0 bottom-0 left-0"></div>

      {/* Div2 - Image */}
      <div className="h-full bg-white">
        <img
          src="https://static.vecteezy.com/system/resources/previews/021/608/790/original/chatgpt-logo-chat-gpt-icon-on-black-background-free-vector.jpg"
          alt="Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default ImageAnimated;
