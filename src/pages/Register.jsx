import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContext } from "../contexts/ToastContext";
import "./Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await window.api.register(username, password);
      if (result.success) {
        showToast("Registered successfully! Please log in.", "success");
        navigate("/login");
      } else {
        const message = "Registration failed. Username might already be taken.";
        setError(message);
        showToast(message, "error");
      }
    } catch (err) {
      const message = "An error occurred. Please try again.";
      setError(message);
      showToast(message, "error");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
