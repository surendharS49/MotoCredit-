import React from 'react';
import logo from '../../assets/motocredit-logo.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [error, setError] = useState('');
  const handleAdminLogin = () => {
    navigate('/admin');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-white to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="MotoCredit logo" className="w-12 h-12" />
          <h2 className="text-2xl font-extrabold tracking-tight text-primary">MotoCredit</h2>
        </div>
        <h2 className="text-xl font-bold mb-6 text-center">Welcome back</h2>
        <form className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#0e141b]">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary-light text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#0e141b]">Password</label>
            <div className="relative flex items-center">
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary-light text-base pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute right-3 text-slate-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
                </svg>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="mt-2 h-12 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-base shadow-md transition-colors"
            onClick={() => {
              if (email && password) {
                // Here you would typically handle the login logic, e.g., API call
                console.log('Logging in with:', { email, password });
                // setError('');
              } else {
                // setError('Please enter both email and password');
              }
            }}
          >
            Login
          </button>
        </form>
        <button
          className="mt-4 text-primary hover:text-primary-dark underline text-sm font-medium transition-colors"
          onClick={handleAdminLogin}
        >
          Admin login
        </button>
      </div>
    </div>
  );
}

export default Login;
