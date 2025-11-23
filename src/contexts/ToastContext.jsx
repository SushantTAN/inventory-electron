import React, { createContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const closeToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast?.message} type={toast?.type} onClose={closeToast} />
    </ToastContext.Provider>
  );
};

