import React, { useMemo } from 'react';
import { getWeekDays, parseISOToDate, formatDayHeader } from '../calendar';

// Time slots from 11:00 AM to 7:00 PM (inclusive)
const HOURS = [11, 12, 13, 14, 15, 16, 17, 18, 19];
const ROW_HEIGHT = '4rem'; // h-16 = 4rem, same for header and every slot row

function hourLabel(hour24) {
  const isPM = hour24 >= 12;
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${hour12}:00 ${isPM ? 'PM' : 'AM'}`;
}

function dayToYYYYMMDD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function SlotCalendar({ today: todayProp, weekStart, events, leaveDates = [] }) {
  const today = todayProp ?? new Date();
  const todayString = today.toDateString();
  const days = useMemo(() => getWeekDays(weekStart, 6), [weekStart]);
  const leaveSet = useMemo(() => new Set(leaveDates), [leaveDates]);

  const eventsByDay = useMemo(() => {
    return days.map((day) => {
      const dayEvents = events
        .map((event) => {
          const start = parseISOToDate(event.start);
          const end = parseISOToDate(event.end);
          return { ...event, __startDate: start, __endDate: end };
        })
        .filter(
          (event) =>
            event.__startDate.toDateString() === day.toDateString(),
        );

      return dayEvents;
    });
  }, [events, days]);

  const todayIndex = days.findIndex(
    (d) => d.toDateString() === todayString,
  );
  const totalHours = HOURS.length;
  const currentHour = today.getHours();
  const todayIndicatorOffset =
    ((currentHour - HOURS[0]) / totalHours) * 100;

  return (
    <div className="relative bg-white">
      <div>
        <table
          className="w-full border-collapse text-[0.9rem]"
          style={{ tableLayout: 'fixed' }}
        >
          <colgroup>
            <col className="w-24" />
            {days.map((day) => (
              <col key={day.toISOString()} className="min-w-[120px] sm:min-w-[100px]" />
            ))}
            <col className="w-24" />
          </colgroup>
          <thead>
            <tr>
              {/* Top-left corner: empty so time column and day headers align */}
              <th
                className="border border-slate-300 bg-slate-50 align-middle"
                style={{ height: ROW_HEIGHT }}
              />
              {days.map((day, dayIdx) => {
                const isToday = dayIdx === todayIndex;
                const isLeaveDay = leaveSet.has(dayToYYYYMMDD(day));
                const dayHeader = formatDayHeader(day);
                return (
                  <th
                    key={day.toISOString()}
                    className={`border px-2 py-2 text-center ${
                      isLeaveDay
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : isToday
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                    style={{ height: ROW_HEIGHT }}
                  >
                    {/* Mobile: stack weekday and date to avoid mixing/overlap */}
                    <div className="sm:hidden flex flex-col items-center leading-tight">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                        {dayHeader.weekday}
                      </span>
                      <span className="text-[10px] text-slate-700">
                        {dayHeader.label.replace(`${dayHeader.weekday}, `, '')}
                      </span>
                    </div>
                    {/* Desktop / tablet: keep single-line compact header */}
                    <div className="hidden sm:block">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] whitespace-nowrap">
                        {dayHeader.weekday}{' '}
                        {dayHeader.label.replace(`${dayHeader.weekday}, `, '')}
                      </span>
                    </div>
                  </th>
                );
              })}
              {/* Top-right corner: empty for right-side time column */}
              <th
                className="border border-slate-300 bg-slate-50 align-middle"
                style={{ height: ROW_HEIGHT }}
              />
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour}>
                {/* Time label cell - same row as the slot row */}
                <td
                  className="border border-slate-300 bg-slate-50 text-right pr-3 text-[11px] font-medium text-slate-500 align-top"
                  style={{ height: ROW_HEIGHT }}
                >
                  {hourLabel(hour)}
                </td>
                {days.map((day, dayIdx) => {
                  const isToday = dayIdx === todayIndex;
                  const isLeaveDay = leaveSet.has(dayToYYYYMMDD(day));
                  const dayHeader = formatDayHeader(day);
                  const dayEvents = eventsByDay[dayIdx] || [];
                  const hourEvents =
                    dayEvents.filter(
                      (event) => event.__startDate.getHours() === hour,
                    ) || [];

                  return (
                    <td
                      key={day.toISOString()}
                      className={`border align-top ${
                        isLeaveDay
                          ? 'bg-red-50 border-red-200'
                          : isToday
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-white border-slate-300'
                      }`}
                      style={{ height: ROW_HEIGHT }}
                    >
                      <div className="relative h-full px-1.5 py-1">
                        <div className="absolute inset-x-1 top-1 bottom-1 rounded-lg bg-slate-50/40" />
                        {hourEvents.map((event, idx) => (
                          <div
                            key={`${event.title}-${idx}`}
                            className="relative z-10 rounded-lg border border-amber-200 bg-indigo-600 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-[0.9rem] text-white shadow-sm w-full max-w-full break-words overflow-hidden"
                          >
                            <div className="text-[10px] sm:text-[11px] font-semibold">
                              {event.title}
                            </div>
                            <div className="mt-0.5 text-[9px] sm:text-[10px] font-medium text-indigo-100">
                              {dayHeader.label} ·{' '}
                              {`${hourLabel(hour)} – ${hourLabel(hour + 1)}`}
                            </div>
                          </div>
                        ))}
                        {/* Today red line - only in today column and current hour row */}
                        {isToday && hour === currentHour && (
                          <div
                            className="pointer-events-none absolute left-0 right-0"
                            style={{ top: `${todayIndicatorOffset}%` }}
                          >
                            <div className="h-[1.5px] w-full bg-red-500" />
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
                {/* Time label on right side */}
                <td
                  className="border border-slate-300 bg-slate-50 text-left pl-3 text-[11px] font-medium text-slate-500 align-top"
                  style={{ height: ROW_HEIGHT }}
                >
                  {hourLabel(hour)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SlotCalendar;
