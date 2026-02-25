import React from 'react';

function CalendarToolbar({
  today,
  rangeLabel,
  onPrevWeek,
  onNextWeek,
  onToday,
  todaysSlotsCount,
  weeklySlotsCount,
  onOpenMobileCalendar,
  onReload,
}) {
  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 bg-white px-1 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 gap-1 sm:gap-2 md:gap-3 min-h-12 sm:min-h-14">
      {/* Left Navigation Controls (next only) */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 z-10 justify-center sm:justify-start w-full sm:w-auto order-3 sm:order-none">
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

      {/* Center - Date Range with reload */}
      {/* Desktop / tablet: keep centered absolute for exact layout */}
      <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
        <span className="pointer-events-none text-[10px] sm:text-xs md:text-sm font-semibold text-slate-800 whitespace-nowrap">
          {rangeLabel}
        </span>
        {onReload && (
          <button
            type="button"
            onClick={onReload}
            className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 pointer-events-auto"
            aria-label="Reload calendar"
          >
            <i className="fa-solid fa-rotate-right text-xs" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Mobile: use normal flow so header doesn't overlap */}
      <div className="flex sm:hidden flex-1 items-center justify-center gap-1 order-2 sm:order-none">
        <span className="text-[10px] font-semibold text-slate-800 whitespace-nowrap">
          {rangeLabel}
        </span>
        {onReload && (
          <button
            type="button"
            onClick={onReload}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
            aria-label="Reload calendar"
          >
            <i className="fa-solid fa-rotate-right text-xs" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Right - Today & Weekly Slots summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-end gap-1 sm:gap-6 flex-shrink-0 pr-2 z-10 text-[10px] sm:text-xs md:text-sm text-slate-700 mt-1 sm:mt-0 text-center sm:text-left order-1 sm:order-none">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1 whitespace-nowrap">
          <span className="font-semibold text-slate-900">
            {todaysSlotsCount}
          </span>
          <span className="leading-tight">Total Slots Today</span>
        </div>
        <span className="hidden sm:inline-block h-3 w-px bg-slate-300" />
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1 whitespace-nowrap">
          <span className="font-semibold text-slate-900">
            {weeklySlotsCount}
          </span>
          <span className="leading-tight">Total Slots This Week</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarToolbar;

