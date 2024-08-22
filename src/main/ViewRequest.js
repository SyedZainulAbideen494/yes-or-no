import React from 'react';
import { useParams } from 'react-router-dom';
import './viewRequest.css';

function ViewRequest() {
  const { encodedData } = useParams();
  
  const decodeData = (data) => {
    try {
      const decoded = atob(decodeURIComponent(data));
      return JSON.parse(decoded);
    } catch (error) {
      return { question: 'Invalid data', message: 'Unable to decode the request.' };
    }
  };

  const { question, message } = decodeData(encodedData);

  return (
    <div className="view-request">
      <header className="view-request-header">
        <h1>Request Details</h1>
      </header>

      <section className="view-request-content">
        <h2>Question</h2>
        <p>{question}</p>
        <h2>Message</h2>
        <p>{message}</p>
      </section>

      <footer className="view-request-footer">
        <p>&copy; {new Date().getFullYear()} Yes or No. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ViewRequest;