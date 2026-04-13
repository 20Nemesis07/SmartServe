import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Header */}
        <div className="home-header">
          <h1 className="app-title">🍽️ Food Waste Management System</h1>
          <p className="app-subtitle">
            Reducing food waste, feeding communities
          </p>
        </div>

        {/* User Type Cards */}
        <div className="user-types-grid">
          {/* Student Card */}
          <div className="user-type-card student-card">
            <div className="card-icon">👨‍🎓</div>
            <h2>Student</h2>
            <p>Book meals and contribute to reducing food waste</p>
            <div className="card-buttons">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-secondary"
              >
                Register
              </button>
            </div>
          </div>

          {/* Mess Staff Card */}
          <div className="user-type-card mess-card">
            <div className="card-icon">👨‍🍳</div>
            <h2>Mess Committee</h2>
            <p>Manage meals and report excess food to NGOs</p>
            <div className="card-buttons">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-secondary"
              >
                Register
              </button>
            </div>
          </div>

          {/* NGO Card */}
          <div className="user-type-card ngo-card">
            <div className="card-icon">🤝</div>
            <h2>NGO</h2>
            <p>Access available food and support communities in need</p>
            <div className="card-buttons">
              <button
                onClick={() => navigate('/ngo/login')}
                className="btn-primary"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/ngo/register')}
                className="btn-secondary"
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h3>Why Use Our Platform?</h3>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">♻️</span>
              <h4>Reduce Waste</h4>
              <p>Minimize food waste by tracking and sharing surplus food</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🤲</span>
              <h4>Help Communities</h4>
              <p>Connect excess food with NGOs serving underprivileged areas</p>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <h4>Track Impact</h4>
              <p>Monitor food donations and environmental impact</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <h4>Secure Platform</h4>
              <p>Safe and secure data management for all users</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="home-footer">
          <p>&copy; 2026 Food Waste Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
