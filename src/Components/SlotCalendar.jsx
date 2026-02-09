import React, { useMemo } from 'react';
import {
  FIXED_TODAY,
  getWeekDays,
  isSameDay,
  parseISOToDate,
  formatDayHeader,
  formatHeaderToday,
} from '../calendar';

const HOURS = [11, 12, 13, 14, 15, 16, 17, 18]; // 11 AM – 7 PM (end at 19)
const CURRENT_TIME_HOUR = 17; // 5:00 PM for the fixed design

function hourLabel(hour24) {
  const isPM = hour24 >= 12;
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${hour12}:00 ${isPM ? 'PM' : 'AM'}`;
}

function SlotCalendar({ weekStart, events }) {
  const days = useMemo(() => getWeekDays(weekStart, 6), [weekStart]);

  const eventsByDay = useMemo(() => {
    return days.map((day) => {
      const dayEvents = events
        .map((event) => {
          const start = parseISOToDate(event.start);
          const end = parseISOToDate(event.end);
          return { ...event, __startDate: start, __endDate: end };
        })
        .filter((event) => isSameDay(event.__startDate, day));

      return dayEvents;
    });
  }, [events, days]);

  const totalHours = HOURS.length;
  const todayIndex = days.findIndex((d) => isSameDay(d, FIXED_TODAY));
  const todayIndicatorOffset =
    ((CURRENT_TIME_HOUR - HOURS[0]) / totalHours) * 100;
  const fullTodayLabel = formatHeaderToday(FIXED_TODAY);

  return (
    <div className="relative bg-white">
      <div className="overflow-x-auto">
        <div className="flex w-full min-w-[720px] border-l border-slate-100">
          {/* Time gutter */}
          <div className="relative w-24 shrink-0 border-r border-slate-100 bg-slate-50">
            <div className="relative">
              {HOURS.map((hour, idx) => (
                <div
                  key={hour}
                  className="relative flex h-16 items-start justify-end pr-3 text-[11px] font-medium text-slate-500"
                >
                  <span className="mt-1">{hourLabel(hour)}</span>
                </div>
              ))}

              {/* Red triangle marker at current time (5 PM) */}
              <div
                className="pointer-events-none absolute left-0 h-0 w-0 -translate-x-1/2 border-y-[6px] border-l-[8px] border-y-transparent border-l-red-500"
                style={{ top: `${todayIndicatorOffset}%` }}
              />
            </div>
          </div>

          {/* Day columns */}
          <div className="flex flex-1">
            {days.map((day, dayIdx) => {
              const isToday = dayIdx === todayIndex;
              const dayHeader = formatDayHeader(day);
              const dayEvents = eventsByDay[dayIdx] || [];

              return (
                <div
                  key={day.toISOString()}
                  className={`relative flex-1 border-r border-slate-100 ${
                    isToday ? 'bg-amber-50/40' : 'bg-white'
                  }`}
                >
                  {/* Day header */}
                  <div
                    className={`sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-3 py-2 backdrop-blur ${
                      isToday
                        ? 'bg-amber-50/90 text-amber-800'
                        : 'text-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                      {dayHeader.weekday}
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      {dayHeader.label.replace(`${dayHeader.weekday}, `, '')}
                    </div>
                    {isToday && (
                      <>
                        <div className="mt-1 inline-flex rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                          Today
                        </div>
                        <div className="mt-1 text-[10px] font-medium text-amber-900">
                          Today: {fullTodayLabel}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Time slots grid */}
                  <div className="relative px-2 pb-4 pt-1">
                    <div className="relative">
                      {HOURS.map((hour, idx) => (
                        <div
                          key={hour}
                          className="relative h-16 border-b border-dashed border-slate-100"
                        >
                          {/* Slot background */}
                          <div className="absolute inset-x-1 top-1 bottom-1 rounded-lg bg-slate-50/40" />
                        </div>
                      ))}

                      {/* Today horizontal red line */}
                      {isToday && (
                        <div
                          className="pointer-events-none absolute left-0 right-0"
                          style={{ top: `${todayIndicatorOffset}%` }}
                        >
                          <div className="h-[1.5px] w-full bg-red-500" />
                        </div>
                      )}

                      {/* Events */}
                      {dayEvents.map((event, idx) => {
                        const startHour = event.__startDate.getHours();
                        const relativeIndex = HOURS.indexOf(startHour);
                        if (relativeIndex === -1) return null;

                        const topPercent = (relativeIndex / totalHours) * 100;
                        const heightPercent = (1 / totalHours) * 100;

                        return (
                          <div
                            key={`${event.title}-${idx}`}
                            className="absolute left-1 right-1 rounded-lg border border-amber-200 bg-indigo-600 px-3 py-2 text-xs text-white shadow-sm"
                            style={{
                              top: `${topPercent}%`,
                              height: `calc(${heightPercent}% - 0.35rem)`,
                            }}
                          >
                            <div className="text-[11px] font-semibold">
                              {event.title}
                            </div>
                            <div className="mt-0.5 text-[10px] font-medium text-indigo-100">
                              {dayHeader.label} ·{' '}
                              {`${hourLabel(startHour)} – ${hourLabel(
                                startHour + 1,
                              )}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlotCalendar;

