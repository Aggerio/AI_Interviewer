// src/components/Resume.js
import React from 'react';
import Navbar from '../pages/Navbar';
function Resume() {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="text-left mr-10">
        <h1 className="text-4xl font-bold mb-4 ">Scan your resume</h1>
        <p className="text-gray-600 mb-4">
          Your resume will be scanned by our AI.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded-full">
          Upload Your Resume
        </button>
      </div>
      <div className="border-dotted border-4 border-gray-400 rounded-lg p-4">
        <img
          src=""
          alt="Webpage Image"
          className="w-64 h-64 object-cover"
        />
      </div>
    </div>
  );
}

export default Resume;
