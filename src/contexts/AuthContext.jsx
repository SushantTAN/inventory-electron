import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
