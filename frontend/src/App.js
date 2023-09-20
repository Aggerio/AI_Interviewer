import React from 'react';
import Navbar from './pages/Navbar';
import Resume from './pages/Resume';
import Stage1 from './pages/Stage1';
import Stage2 from './pages/Stage2';

function App() {
  return (
    // Overall page container with a flex layout

    <div className="relative bg-deep-blue min-h-screen flex flex-col overflow-hidden">
      {/* Navigation bar */}
      <Navbar />
      <div>
        <Resume/>
      </div>
      <div>
        <Stage1/>
      </div>
      <div>
        <Stage2/>
      </div>
    </div>
  );
}

export default App;
