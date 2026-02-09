import React from 'react';
import { FIXED_TODAY, formatHeaderToday } from '../calendar';

function CalendarToolbar({
  rangeLabel,
  onPrevWeek,
  onNextWeek,
  onToday,
  todaysSlotsCount,
  onOpenMobileCalendar,
}) {
  const todayLabel = formatHeaderToday(FIXED_TODAY);

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-1 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 gap-1 sm:gap-2 md:gap-3 min-h-12 sm:min-h-14 overflow-x-auto">
      {/* Left Navigation Controls */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onPrevWeek}
          className="inline-flex h-6 w-6 sm:h-7 md:h-8 sm:w-7 md:w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 flex-shrink-0"
        >
          <span className="sr-only">Previous week</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3 w-3 sm:h-3.5 md:h-4 sm:w-3.5 md:w-4"
          >
            <path d="M15 6l-6 6 6 6" />
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

      {/* Center - Date Range (shrinks strategically) */}
      <div className="flex items-center justify-center flex-1 min-w-0">
        <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-800 truncate px-1">
          {rangeLabel}
        </span>
        <span className="hidden sm:block text-[9px] md:text-[10px] font-medium text-slate-600 whitespace-nowrap ml-1 md:ml-2 px-1">
          {todayLabel}
        </span>
        {/* Calendar open button (desktop & mobile) */}
        <button
          type="button"
          onClick={() => onOpenMobileCalendar && onOpenMobileCalendar()}
          className="ml-2 text-slate-600"
          aria-label="Open calendar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4"/></svg>
        </button>
      </div>

      {/* Right - Slots Count and Next Button */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] md:text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 whitespace-nowrap flex-shrink-0">
          <span className="hidden sm:inline text-[9px] md:text-[10px]">Slots:&nbsp;</span>
          <span className="ml-0 sm:ml-0.5 rounded-full bg-emerald-600 px-1 sm:px-1.5 md:px-2 py-0.5 text-[8px] sm:text-[9px] md:text-[10px] font-bold text-white">
            {todaysSlotsCount}
          </span>
        </span>

        <button
          type="button"
          onClick={onNextWeek}
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
      </div>
    </div>
  );
}

export default CalendarToolbar;

