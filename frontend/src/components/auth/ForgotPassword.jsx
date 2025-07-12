import React from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <div className="login-root" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <div className="layout-container">
        <header className="header">
          <div className="logo-group">
            <div className="logo-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="logo-text">MotoCredit Admin</h2>
          </div>
        </header>

        <div className="content">
          <div className="form-container">
            <h2 className="form-title">Reset password</h2>

            <div className="form-group">
              <label className="form-label">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="Enter your admin email"
                  className="form-input"
                />
              </label>
            </div>

            <div className="form-action">
              <button className="login-button">
                <span className="truncate">Send reset link</span>
              </button>
            </div>

            <p className="signup-link" onClick={handleBack}>Back to login</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
