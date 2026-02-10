import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const ADMIN_MOBILE = '9999999999';
const ADMIN_PASSWORD = '9999';
const ADMIN_AUTH_KEY = 'sb_admin_authed';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (mobileNumber === ADMIN_MOBILE && password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      navigate('/admin');
      return;
    }
    setError('Invalid admin mobile number or password');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-xl font-bold text-white">Admin</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-slate-900 mb-1">Admin Login</h1>
        <p className="text-center text-slate-500 text-sm mb-6">Use admin credentials to continue</p>

        {error ? (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-2">Mobile Number</label>
          <input
            type="tel"
            placeholder="9999999999"
            value={mobileNumber}
            onChange={(e) => {
              setError('');
              setMobileNumber(e.target.value);
            }}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="9999"
              value={password}
              onChange={(e) => {
                setError('');
                setPassword(e.target.value);
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {passwordVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Login
        </button>

        <p className="mt-4 text-xs text-slate-500 text-center">
          Hardcoded admin credentials: <span className="font-semibold">9999999999</span> /{' '}
          <span className="font-semibold">9999</span>
        </p>
      </div>
    </div>
  );
}

export function isAdminAuthed() {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
}

