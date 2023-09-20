import React from 'react';
import LeftColumn from '../elements/LeftColumn';
import RightColumn from '../elements/RightColumn';

function Stage1() {
  return (

    <div className="relative bg-deep-blue min-h-screen flex flex-col overflow-hidden">
      <div className="flex-grow flex">
        <div className="w-1/4 border-r p-4">
          <LeftColumn />
        </div>
        <div className="w-3/4 p-4">
          <RightColumn />
        </div>
      </div>
    </div>
  );
}

export default Stage1;
