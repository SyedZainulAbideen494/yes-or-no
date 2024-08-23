import React, { useState } from 'react';
import { FaShareAlt, FaWhatsapp, FaClipboard, FaInstagram } from 'react-icons/fa';
import Confetti from 'react-confetti';
import './home.css';

function Home() {
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');
  const [requestCreated, setRequestCreated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const encodeData = (data) => encodeURIComponent(btoa(data));

  const handleCreateRequest = () => {
    if (question && message) {
      setRequestCreated(true);
      setShowModal(true);
      setConfetti(true); // Trigger confetti
      setTimeout(() => setConfetti(false), 3000); // Stop confetti after 3 seconds
    } else {
      alert('Please fill out both fields before creating a request.');
    }
  };

  const getLink = () => {
    const data = JSON.stringify({ question, message });
    const encodedData = encodeData(data);
    return `${window.location.origin}/view/${encodedData}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getLink())
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Error copying link: ', err));
  };

  const handleShareWhatsApp = () => {
    const link = getLink();
    const message = `Check out this request: ${link}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async () => {
    const siteURL = getLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Request',
          text: 'Check out this request',
          url: siteURL,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleShareWhatsApp();
    }
  };

  return (
    <div className="home">
      {confetti && <Confetti />} {/* Render confetti when triggered */}
      <header className="home-header">
        <h1>Yes or No App</h1>
        <p>Create requests that only allow a "Yes" response!</p>
      </header>
      <section id="create" className="home-create">
        <h2>Create Your Request</h2>
        <div className="create-form">
          <input
            type="text"
            placeholder="Enter your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            aria-label="Question input"
          />
          <textarea
            placeholder="Enter the message to display after 'Yes'..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Message input"
          />
          <button onClick={handleCreateRequest}>Create Request</button>
          {requestCreated && (
            <div className="success-message">
              <p>Request created successfully!</p>
              <p>Share this link:</p>
              <a href={getLink()} target="_blank" rel="noopener noreferrer">
                <p>Link here!</p>
              </a>
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="share-modal" onClick={() => setShowModal(false)}>
          <button className="close-button" onClick={() => setShowModal(false)}>Close</button>
          <h2>Share Your Request</h2>
          <div className="share-buttons">
            <button onClick={handleShare}>
              <FaShareAlt /> Share
            </button>
            <button onClick={handleShareWhatsApp}>
              <FaWhatsapp /> WhatsApp
            </button>
            <button onClick={handleCopyLink}>
              <FaClipboard /> Copy Link
            </button>
          </div>
        </div>
      )}

      <section id="about" className="home-about">
        <h2>About This App</h2>
        <p>
          This app allows you to create simple requests for others. Users can only respond with a "Yes" to these requests. 
          If they click "Yes", they will receive a custom message you provide. The requests can be shared via link, WhatsApp, 
          or copied to the clipboard for easy distribution.
        </p>
      </section>

      <section id="faq" className="home-faq">
        <h2>FAQ</h2>
        <div className="faq-item">
          <h3>How do I create a request?</h3>
          <p>Fill out the form in the "Create Your Request" section with your question and message, then click "Create Request".</p>
        </div>
        <div className="faq-item">
          <h3>Can I edit a request after creating it?</h3>
          <p>Currently, once a request is created, it cannot be edited. You will need to create a new request.</p>
        </div>
      </section>

      <section id="footer" className="home-footer">
        <p>&copy; {new Date().getFullYear()} Yes or No App. All rights reserved.</p>
        <div className="footer-social">
          <a href="https://www.instagram.com/_syed_zain_ul" target="_blank" rel="noopener noreferrer">
            <FaInstagram /> Follow me on Instagram
          </a><br/>
        </div>
      </section>
    </div>
  );
}

export default Home;