import { React, useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatGpt() {
  const [currentText, setCurrentText] = useState('Welcome to the Interview');

  function update_response() {
    axios.get('http://localhost:5002/updates')
      .then((json_data) => {
        // console.log(json_data);
        const update = json_data.data.updated;
        if (update) {
          setCurrentText(json_data.data.response);
        }
      });
  }

  useEffect(() => {
    //Check for updates every second
    const interval = setInterval(() => update_response(), 1000)

    return (() => {
      clearInterval(interval);

    });
  }, []);


  return (<div><p className="text-white"> {currentText}</p></div>);
}
