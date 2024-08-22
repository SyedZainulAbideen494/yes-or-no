import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import './home.css';

function Home() {
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');
  const [requestCreated, setRequestCreated] = useState(false);
  const [encodedUrl, setEncodedUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const nav = useNavigate();

  const encodeData = (data) => {
    return encodeURIComponent(btoa(data));
  };

  const handleCreateRequest = () => {
    if (question && message) {
      const data = JSON.stringify({ question, message });
      const encodedData = encodeData(data);
      const url = `${window.location.origin}/view/${encodedData}`;
      setEncodedUrl(url);
      setRequestCreated(true);
      setShowModal(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(encodedUrl);
    alert('Link copied to clipboard!');
  };

  const handleShare = (platform) => {
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(encodedUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(encodedUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(encodedUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(encodedUrl)}`,
    };
    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="home">
      {requestCreated && showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <Confetti />
            <h2>Request Created Successfully!</h2>
            <p>Share this link:</p>
            <div className="modal-link">
              <a href={encodedUrl} target="_blank" rel="noopener noreferrer">{encodedUrl}</a>
              <button onClick={handleCopyLink}>Copy Link</button>
            </div>
            <div className="share-buttons">
              <button onClick={() => handleShare('whatsapp')}>Share on WhatsApp</button>
              <button onClick={() => handleShare('telegram')}>Share on Telegram</button>
              <button onClick={() => handleShare('facebook')}>Share on Facebook</button>
              <button onClick={() => handleShare('twitter')}>Share on Twitter</button>
            </div>
            <button className="close-button" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
      
      <header className="home-header">
        <nav className="home-nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#create">Create Request</a></li>
            <li><a href="#footer">Contact</a></li>
          </ul>
        </nav>
        <h1>Welcome to the Yes or No App</h1>
        <p>Make your interactions more engaging with simple yes or no decisions.</p>
      </header>

      <section id="create" className="home-create">
        <h2>Create a New Request</h2>
        <p>Set up your request below and share it with others to get quick responses. Just fill out the details and click the button to create your request.</p>
        <div className="create-form">
          <input
            type="text"
            placeholder="Enter your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <textarea
            placeholder="Enter the message to display after 'Yes'..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleCreateRequest}>Create Request</button>
        </div>
      </section>

      <footer id="footer" className="home-footer">
        <p>Follow me on Instagram</p>
        <a href="https://www.instagram.com/_syed_zain_ul" target="_blank" rel="noopener noreferrer" className="footer-link">
          Follow me on Instagram @_syed_zain_ul
        </a>
        <p>&copy; {new Date().getFullYear()} Yes or No. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;