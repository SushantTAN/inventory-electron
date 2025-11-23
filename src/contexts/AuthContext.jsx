import React, { createContext, useState, useEffect, useContext } from "react";
import { ToastContext } from "./ToastContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    // This is a simple in-memory session.
    // For a real app, you'd use sessionStorage or secure storage.
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const result = await window.api.login(username, password);
    if (result.success) {
      setUser(result.user);
      sessionStorage.setItem("user", JSON.stringify(result.user));
      showToast("Logged in successfully!", "success");
    } else {
      showToast(result.message || "Login failed.", "error");
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    showToast("Logged out successfully!", "info");
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
