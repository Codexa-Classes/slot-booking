import React, { useMemo } from 'react';
import {
  FIXED_TODAY,
  getWeekDays,
  isSameDay,
  parseISOToDate,
  formatDayHeader,
} from '../calendar';

// Time slots from 11:00 AM to 7:00 PM (inclusive)
const HOURS = [11, 12, 13, 14, 15, 16, 17, 18, 19];
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

  const todayIndex = days.findIndex((d) => isSameDay(d, FIXED_TODAY));
  const totalHours = HOURS.length;
  const todayIndicatorOffset =
    ((CURRENT_TIME_HOUR - HOURS[0]) / totalHours) * 100;

  return (
    <div className="relative bg-white">
      <div className="overflow-x-auto">
        <div className="flex w-full min-w-[720px] border-l border-slate-100">
          {/* Time gutter */}
          <div className="relative w-24 shrink-0 border-r border-slate-100 bg-slate-50">
            <div className="relative">
              {/* spacer so time labels align with first slot row */}
              <div className="h-16 border-b border-slate-100" />
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="relative flex h-16 items-center justify-end pr-3 text-[11px] font-medium text-slate-500"
                >
                  <span>{hourLabel(hour)}</span>
                </div>
              ))}
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
                  className="relative flex-1 border-r border-slate-100 bg-white"
                >
                  {/* Day header */}
                  <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-3 py-2 text-slate-700">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                      {dayHeader.weekday}
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      {dayHeader.label.replace(`${dayHeader.weekday}, `, '')}
                    </div>
                  </div>

                  {/* Time slots grid */}
                  <div className="relative px-2 pb-4 pt-1">
                    {HOURS.map((hour) => {
                      const hourEvents =
                        dayEvents.filter(
                          (event) => event.__startDate.getHours() === hour,
                        ) || [];

                      return (
                        <div
                          key={hour}
                          className="relative h-16 border-b border-dashed border-slate-100"
                        >
                          {/* Slot background */}
                          <div className="absolute inset-x-1 top-1 bottom-1 rounded-lg bg-slate-50/40" />

                          {/* Events exactly in this row */}
                          {hourEvents.map((event, idx) => (
                            <div
                              key={`${event.title}-${idx}`}
                              className="relative z-10 mx-1 rounded-lg border border-amber-200 bg-indigo-600 px-3 py-2 text-xs text-white shadow-sm"
                            >
                              <div className="text-[11px] font-semibold">
                                {event.title}
                              </div>
                              <div className="mt-0.5 text-[10px] font-medium text-indigo-100">
                                {dayHeader.label} ·{' '}
                                {`${hourLabel(hour)} – ${hourLabel(hour + 1)}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {/* Today horizontal red line */}
                    {isToday && (
                      <div
                        className="pointer-events-none absolute left-0 right-0"
                        style={{ top: `${todayIndicatorOffset}%` }}
                      >
                        <div className="h-[1.5px] w-full bg-red-500" />
                      </div>
                    )}
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

