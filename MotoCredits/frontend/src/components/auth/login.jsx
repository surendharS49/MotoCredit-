import React from 'react';
import './login.css';

function Login() {
  return (
    <div className="login-root" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <div className="layout-container">
        <header className="header">
          <div className="logo-group">
            <div className="logo-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="logo-text">MotoCredit</h2>
          </div>
        </header>

        <div className="content">
          <div className="form-container">
            <h2 className="form-title">Welcome back</h2>

            <div className="form-group">
              <label className="form-label">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                <p>Password</p>
                <div className="password-wrapper">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="form-input password-input"
                  />
                  <div className="eye-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"
                      />
                    </svg>
                  </div>
                </div>
              </label>
            </div>

            <div className="form-action">
              <button className="login-button">
                <span className="truncate">Login</span>
              </button>
            </div>

            <p className="signup-link">Don't have an account? Sign up</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
