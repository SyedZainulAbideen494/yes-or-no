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
      const decoded = atob(decodeURIComponent(data));
      return JSON.parse(decoded);
    } catch (error) {
      return { question: 'Invalid data', message: 'Unable to decode the request.' };
    }
  };

  const { question, message } = decodeData(encodedData);

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
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    if (!isNoClicked) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      const interval = setInterval(moveNoButtonAway, 20); // Faster interval for mobile

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isNoClicked, cursorPosition, isMobile]);

  const handleNoClick = (e) => {
    e.preventDefault();
    setIsNoClicked(true);

    const noButton = noButtonRef.current;
    if (noButton) {
      const buttonRect = noButton.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Original button position
      const originalX = buttonRect.left;
      const originalY = buttonRect.top;

      // Random new position ensuring it's more than 100px away
      let newX, newY;
      do {
        newX = Math.random() * (viewportWidth - buttonRect.width);
        newY = Math.random() * (viewportHeight - buttonRect.height);
      } while (Math.abs(newX - originalX) < 100 || Math.abs(newY - originalY) < 100);

      // Apply new position
      noButton.style.transition = 'transform 0.1s';
      noButton.style.transform = `translate(${newX}px, ${newY}px)`;

      // Reset button position after a brief delay
      setTimeout(() => {
        noButton.style.transform = 'translate(0, 0)';
      }, 1000); // Adjust this delay as needed
    }
  };

  return (
    <div className="view-request">
      <div className="view-request-box">
        {!isYesClicked && (
          <header className="view-request-header">
            <h1>{question}</h1>
          </header>
        )}

        <section className="view-request-buttons">
          {!isYesClicked && (
            <>
              <button
                className="view-request-button yes-button"
                onClick={() => setIsYesClicked(true)}
              >
                Yes
              </button>
              <button
                className="view-request-button no-button"
                ref={noButtonRef}
                onClick={handleNoClick}
              >
                No
              </button>
            </>
          )}
        </section>

        {isYesClicked && (
          <section className="view-request-content">
            <h2>Message</h2>
            <p>{message}</p>
          </section>
        )}

        <footer className="view-request-footer">
          {isYesClicked ? (
            <>
              <p><a href="/">Create yours</a></p>
            </>
          ) : (
            <p></p>
          )}
        </footer>
      </div>
    </div>
  );
}

export default ViewRequestPc;