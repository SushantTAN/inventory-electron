import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Allow time for fade-out animation before calling onClose
        setTimeout(onClose, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type} ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default Toast;
