import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import './viewRequest.css';

// Lazy load components
const ViewRequestPc = lazy(() => import('../main/view-request/ViewRequestPc'));
const ViewRequestMobile = lazy(() => import('../main/view-request/ViewRequestMobile'));

function ViewRequest() {
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
      noButton.style.transition = 'transform 0.1s ease-out';
      noButton.style.transform = `translate(${Math.random() * 300}px, ${Math.random() * 300}px)`;

      // Reset button position after a brief delay
      setTimeout(() => {
        if (noButton) {
          noButton.style.transition = 'transform 0.3s ease-in-out';
          noButton.style.transform = 'translate(0, 0)';
        }
      }, 100); // Delay before returning to original position
    }
  };

  return (

    
        <Suspense fallback={<div>Loading...</div>}>
          {isMobile ? (
            <ViewRequestMobile
            />
          ) : (
            <ViewRequestPc
   
            />
          )}
        </Suspense>

  );
}

export default ViewRequest;