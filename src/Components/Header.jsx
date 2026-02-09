import React from 'react';
import { FIXED_TODAY, formatHeaderToday } from '../calendar';
import { Link } from "react-router-dom";

function Header({ todaysSlotsCount, fullWidth = false }) {
  const todayLabel = formatHeaderToday(FIXED_TODAY);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className={fullWidth ? "w-full px-4 py-2 h-14 flex items-center" : "mx-auto max-w-6xl px-2 sm:px-4 py-2 sm:py-3 h-14 flex items-center"}>
        {/* Top row: logo + title + domain + login */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 w-full">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full bg-indigo-600 text-xs sm:text-sm font-semibold text-white shadow-sm flex-shrink-0">
              SB
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 truncate">
                Slot Booking Calendar
              </span>
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-400 truncate">
                Weekly schedule overview
              </span>
            </div>
          </div>

          {/* Middle: domain - hidden on mobile */}
          <div className="hidden sm:block text-xs sm:text-sm font-semibold text-slate-500 flex-shrink-0">
            virajkadam.in
          </div>

          {/* Right: Login Button */}
          <Link
            to="/login"
            className="rounded-full bg-indigo-600 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 whitespace-nowrap flex-shrink-0"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

