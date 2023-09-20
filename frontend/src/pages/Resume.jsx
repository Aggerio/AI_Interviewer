import React, { useState } from 'react';
function Resume() {
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileSelect(e) {
    const file = e.target.files[0];

    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select6 a valid PDF file.');
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-left mr-10">
        <h1 className="text-4xl font-bold mb-4">Scan your resume</h1>
        <p className="text-gray-600 mb-4">
          Your resume will be scanned by our AI.
        </p>
        <label
          htmlFor="fileInput"
          className="bg-yellow hover:bg-rose-300 font-bold py-2 px-4 rounded-full cursor-pointer transform hover:scale-105 transition-transform"
        >
          Upload Your Resume
        </label>
        <input
          type="file"
          id="fileInput"
          accept=".pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      <div className="border-dotted border-4 border-gray-400 rounded-lg p-4">
        
        <img
          src="https://www.arlo.co/wp-content/uploads/2022/04/Training-Course-Software-500px.svg"
          alt="Webpage Image"
          className="w-64 h-64 object-cover"

        />
      </div>
    </div>
  );
}

export default Resume;
