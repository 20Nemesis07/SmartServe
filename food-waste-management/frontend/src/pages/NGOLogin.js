import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNGOAuthStore from '../context/useNGOAuthStore';
import '../styles/auth.css';

export default function NGOLogin() {
  const navigate = useNavigate();
  const { loginNGO, isLoading, error } = useNGOAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginNGO(formData.email, formData.password);
      navigate('/ngo/dashboard');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>🤝 NGO Portal</h1>
        <h2>Login</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/ngo/register">Register here</a>
        </p>
        <p className="auth-link">
          <a href="/login">Back to Student/Staff Login</a>
        </p>
      </div>
    </div>
  );
}
