import { React, useRef, useEffect, useState } from "react";
import { Editor } from '@monaco-editor/react';
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';

function CodeEditor() {
  const monacoRef = useRef(null);
  const [executing, setExecution] = useState(false);
  const [intervalFunction, setIF] = useState(null);
  const [language, setLanguage] = useState('python');
  const [submissionToken, setSubmissionToken] = useState(null);

  function handleEditorWillMount(monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorDidMount(editor, monaco) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monacoRef.current = editor;
  }

  function getSubmissionStatus(token_id) {

  }

  function handleRun() {
    // console.log(monacoRef.current.getValue());
    axios.post('http://localhost:5000/run', { srcCode: monacoRef.current.getValue(), language: language })
      .then(function(response) {
        console.log(response.data.success);
        if (response.data.success) {
          setExecution(true);
          setSubmissionToken(response.data.token);
        };
      })
      .catch(function(error) {
        // console.log(`Server error ${error}`)
        // TODO use react toast
        // toast.error("Server error! Contact developer")

      })
  }

  function handleSubmit() {
    console.log("submit code");
  }

  useEffect(() => {

    if (executing) {
      const intervalId = setInterval(() => {
        console.log('this will run every 500 milliseconds')
      }, 500);
      setIF(intervalId);

      //TODO continously check if execution has ended 
      //if it has set executing to false and show results
    }
    else {
      if (intervalFunction != null) {
        clearInterval(intervalFunction);
        setIF(null);
      }
    }


    return () => {

    };

  }, [executing]);

  return (
    <div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
      <div>
        <Editor
          height="50vh"
          width="100vh"
          defaultLanguage={language}
          theme="vs-dark"
          defaultValue="// some comment"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
        />
      </div>

      <div className="w-[100px] bg-red-300" >
        <button onClick={handleRun} disabled={executing}>  run solution </button>
      </div>
      <div className="w-[100px] bg-blue-100">
        <button onClick={handleSubmit} disabled={executing}> Submit solution </button>
      </div>
      {executing ? <h1>Executing </h1> : <div></div>}
    </div>
  );
}

export default CodeEditor;
