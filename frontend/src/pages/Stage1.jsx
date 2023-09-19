import React from 'react';
import Navbar from './pages/Navbar';
import LeftColumn from './elements/LeftColumn';
import RightColumn from './elements/RightColumn';

function Stage1() {
  return (
    // Overall page container with a flex layout
    <div className="relative bg-deep-blue min-h-screen flex flex-col overflow-hidden">
      {/* Navigation bar */}
      <Navbar />

      {/* Flex container for columns */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Column (1/4 of the width) with border and padding */}
        <div className="w-1/4 border-r p-4">
          <LeftColumn />
        </div>

        {/* Right Column (3/4 of the width) with padding */}
        <div className="w-3/4 p-4">
          <RightColumn />
        </div>
      </div>
    </div>
  );
}

export default Stage1;
