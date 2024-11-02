import React, { useEffect } from 'react';
// import './Notification.css';

const Notification = ({ message, type, onClose }) => {
  const colorStyles = {
    success: { backgroundColor: 'green' },
    error: { backgroundColor: 'red' },
    info: { backgroundColor: 'blue' },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();  
    }, 1200);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div>
    <div className="notification" style={{ 
      ...colorStyles[type], 
      position: 'fixed', 
      top: '0px', 
      padding: '10px', 
      borderRadius: '5px', 
      zIndex: 1000 
    }}>
      <span style={{ color: 'white' }}>{message}</span>
    </div></div>
  );
};

export default Notification;
