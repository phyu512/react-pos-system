import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../paths';

const IDLE_TIME = 5 * 60 * 1000; // 15 Minutes

const IdleTimer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  // Use 'number' or the ReturnType trick to avoid the NodeJS namespace
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = () => {
    console.log("User idle for too long. Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Ensure PATHS.LOGIN is defined in your paths.ts
    navigate(PATHS.LOGIN || '/portal/login', { replace: true });
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // In the browser, window.setTimeout returns a number
    timerRef.current = setTimeout(handleLogout, IDLE_TIME);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Start the timer on mount
    resetTimer();

    // Add listeners to reset the timer on any activity
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return <>{children}</>;
};

export default IdleTimer;