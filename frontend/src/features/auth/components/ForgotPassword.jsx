import React from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-white to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-12 h-12 flex items-center justify-center bg-primary-light rounded-full">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary">
              <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor" />
            </svg>
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary">MotoCredit Admin</h2>
        </div>
        <h2 className="text-xl font-bold mb-6 text-center">Reset password</h2>
        <form className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#0e141b]">Email</label>
            <input
              type="email"
              placeholder="Enter your admin email"
              className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary-light text-base"
            />
          </div>
          <button
            type="button"
            className="mt-2 h-12 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-base shadow-md transition-colors"
          >
            Send reset link
          </button>
        </form>
        <button
          className="mt-4 text-primary hover:text-primary-dark underline text-sm font-medium transition-colors"
          onClick={handleBack}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
