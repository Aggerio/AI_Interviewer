import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import axios from 'axios';

function Question() {
  const [markdownText, setMarkdownText] = useState('');
  const [htmlText, setHtmlText] = useState('');
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    // Fetch the Markdown content from the URL
    axios.get('http://localhost:5000/get_question')
      .then((response) => response.text())
      .then((data) => {
        // Set the fetched Markdown text in state
        setMarkdownText(data);
        // Convert the Markdown text to HTML
        const html = marked(data);
        setHtmlText(html);
      })
      .catch((error) => {
        console.error('Error fetching Markdown content:', error);
      });
  }, []);

  return (
    <div>
      <h1>Question</h1>
      <div className="@apply text-left">
        <div dangerouslySetInnerHTML={{ __html: htmlText }} />
      </div>
    </div>
  );
};

export default Question;

