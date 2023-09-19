import React from 'react';
import Navbar from './pages/Navbar';
import Resume from './pages/Resume';

function App() {
  return (
    // Overall page container with a flex layout

    <div className="relative bg-deep-blue min-h-screen flex flex-col overflow-hidden">
      {/* Navigation bar */}
      <Navbar />
      <div>
        <Resume/>
      </div>
    </div>
  );
}

export default App;
