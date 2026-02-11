import React from 'react';
import { FIXED_TODAY, formatHeaderToday } from '../calendar';

function CalendarToolbar({
  rangeLabel,
  onPrevWeek,
  onNextWeek,
  onToday,
  todaysSlotsCount,
  weeklySlotsCount,
  onOpenMobileCalendar,
}) {
  const todayLabel = formatHeaderToday(FIXED_TODAY);

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-1 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 gap-1 sm:gap-2 md:gap-3 min-h-12 sm:min-h-14 overflow-x-auto">
      {/* Left Navigation Controls (next only) */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={
            onNextWeek
              ? onNextWeek
              : (e) => {
                  e.preventDefault();
                }
          }
          className="inline-flex h-6 w-6 sm:h-7 md:h-8 sm:w-7 md:w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 flex-shrink-0"
        >
          <span className="sr-only">Next week</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3 w-3 sm:h-3.5 md:h-4 sm:w-3.5 md:w-4"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onToday}
          className="rounded-full border border-slate-300 bg-white px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 text-[10px] sm:text-xs md:text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm transition hover:bg-slate-50 whitespace-nowrap flex-shrink-0"
        >
          today
        </button>
      </div>

      {/* Center - Date Range */}
      <div className="flex items-center justify-center flex-1 min-w-0">
        <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-800 truncate px-1">
          {rangeLabel}
        </span>
        <span className="hidden sm:block text-[9px] md:text-[10px] font-medium text-slate-600 whitespace-nowrap ml-1 md:ml-2 px-1">
          {todayLabel}
        </span>
        {/* Calendar open button removed per design */}
      </div>

      {/* Right - Today & Weekly Slots summary (like screenshot) */}
      <div className="flex items-center gap-8 sm:gap-10 md:gap-12 flex-shrink-0 pr-2">
        <div className="flex flex-col items-center">
          <span className="text-sm sm:text-base font-semibold text-slate-900">
            {todaysSlotsCount}
          </span>
          <span className="mt-0.5 text-[9px] sm:text-[10px] font-medium text-slate-500">
            Total Slots
          </span>
          <span className="text-[9px] sm:text-[10px] font-medium text-slate-500">
            Today
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm sm:text-base font-semibold text-slate-900">
            {weeklySlotsCount}
          </span>
          <span className="mt-0.5 text-[9px] sm:text-[10px] font-medium text-slate-500">
            Total This Week
          </span>
          <span className="text-[9px] sm:text-[10px] font-medium text-slate-500">
            Slots
          </span>
        </div>
      </div>
    </div>
  );
}

export default CalendarToolbar;

