import React from 'react';

function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="modal">
        <button onClick={onClose} className="close-button">X</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;

