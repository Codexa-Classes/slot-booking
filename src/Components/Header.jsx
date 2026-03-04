import React from 'react';
import { Link } from 'react-router-dom';

function Header({ fullWidth = false }) {
  return (
    <header className="w-full bg-slate-100">
      <div
        className={
          fullWidth
            ? 'w-full px-4 py-2 h-14 flex items-center'
            : 'mx-auto max-w-6xl px-4 py-2 h-14 flex items-center'
        }
      >
        <div className="relative flex items-center justify-between w-full">
          {/* Left spacer (no logo) */}
          <div className="w-8 sm:w-10" />

          {/* Center: Slot Booking */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="text-sm sm:text-base font-semibold text-purple-700 truncate">
              Slot Booking
            </span>
          </div>

          {/* Right: Login button */}
          <Link
            to="/login"
            className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-purple-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

