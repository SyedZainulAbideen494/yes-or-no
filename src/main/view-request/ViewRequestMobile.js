import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../viewRequest.css';

function ViewRequestPc() {
  const { encodedData } = useParams();
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [isNoClicked, setIsNoClicked] = useState(false);
  const noButtonRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const decodeData = (data) => {
    try {
      const decoded = decodeURIComponent(escape(atob(data)));
      return JSON.parse(decoded);
    } catch (error) {
      return { question: 'Invalid data', message: 'Unable to decode the request.', yesButtonText: 'Yes', noButtonText: 'No' };
    }
  };

  const { question, message, yesButtonText, noButtonText } = decodeData(encodedData);

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      setCursorPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const moveNoButtonAway = () => {
    if (noButtonRef.current) {
      const noButton = noButtonRef.current;
      const buttonRect = noButton.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      const offsetX = cursorPosition.x - buttonCenterX;
      const offsetY = cursorPosition.y - buttonCenterY;

      const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);
      const moveDistance = isMobile ? 150 : 300; // Adjust moveDistance for mobile devices

      if (distance < moveDistance) {
        const angle = Math.atan2(offsetY, offsetX);
        const newX = buttonCenterX - moveDistance * Math.cos(angle);
        const newY = buttonCenterY - moveDistance * Math.sin(angle);

        noButton.style.transform = `translate(${newX - buttonRect.left}px, ${newY - buttonRect.top}px)`;
      } else {
        noButton.style.transform = 'none';
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [cursorPosition]);

  useEffect(() => {
    moveNoButtonAway();
  }, [cursorPosition]);

  const handleYesClick = () => {
    setIsYesClicked(true);
    setIsNoClicked(false);
  };

  const handleNoClick = () => {
    setIsNoClicked(true);
    setIsYesClicked(false);
  };

  return (
    <div className="view-request">
      <header className="view-request-header">
        <h1>View Your Request</h1>
      </header>
      <section className="view-request-content">
        <h2>{question}</h2>
        <div className="view-request-buttons">
          <button className={`yes-button ${isYesClicked ? 'clicked' : ''}`} onClick={handleYesClick}>
            {yesButtonText || 'Yes'}
          </button>
          <button
            ref={noButtonRef}
            className={`no-button ${isNoClicked ? 'clicked' : ''}`}
            onClick={handleNoClick}
          >
            {noButtonText || 'No'}
          </button>
        </div>
        {isYesClicked && <p className="message">{message}</p>}
        {isNoClicked && <p className="message">You clicked No.</p>}
      </section>
    </div>
  );
}

export default ViewRequestPc;