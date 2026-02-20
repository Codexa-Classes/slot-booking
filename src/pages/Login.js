import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible((v) => !v);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    // Trim input values
    const trimmedMobile = mobile.trim();
    const trimmedPassword = password.trim();

    if (!trimmedMobile || !trimmedPassword) {
      setLocalError('Please enter both mobile number and password.');
      setLoading(false);
      return;
    }

    try {
      // Query Firestore "users" collection where mobile == entered mobile
      const q = query(collection(db, 'users'), where('mobile', '==', trimmedMobile));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLocalError('User not found');
        return;
      }

      const userData = querySnapshot.docs[0].data();
      console.log('User Data:', userData);

      // Compare password as strings (trimmed)
      const storedPassword = String(userData?.password ?? '').trim();
      const enteredPassword = String(trimmedPassword);

      if (storedPassword !== enteredPassword) {
        setLocalError('Invalid password');
        return;
      }

      const role = userData?.role?.trim().toLowerCase();
      console.log('Role:', role);

      // Store session for logout / future use
      localStorage.setItem(
        'sb_user',
        JSON.stringify({
          mobile: trimmedMobile,
          role,
          name: (userData?.name || '').trim(),
        }),
      );

      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/candidate-dashboard', { replace: true });
      }
    } catch (err) {
      console.error(err);
      setLocalError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-16 sm:pt-24 p-4">
      <button
        type="button"
        onClick={handleGoHome}
        className="mb-4 text-purple-600 text-sm font-medium hover:underline"
      >
        Home
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Slot Booking
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Login with your registered mobile number and password.
        </p>

        {localError ? (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {localError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-600 mb-2">
              Mobile No
            </label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-600 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {passwordVisible ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 rounded-lg transition duration-200 ease-in-out"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

