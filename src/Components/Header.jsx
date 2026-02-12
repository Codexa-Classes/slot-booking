import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';

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
          {/* Left: Logo (for balance) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 w-32">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white shadow flex items-center justify-center flex-shrink-0">
              <img src={logo} alt="Slot Booking" className="h-6 w-6" />
            </div>
          </div>

          {/* Center: Slot Booking Calendar */}
          <span className="absolute left-1/2 -translate-x-1/2 text-sm sm:text-base font-semibold text-purple-700 truncate">
            Slot Booking Calendar
          </span>

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

