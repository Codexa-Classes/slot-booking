import React, { useMemo, useState, useEffect } from 'react';
import {
  getWeekStart,
  getWeekDays,
  formatWeekRangeLabel,
  parseISOToDate,
  isSameDay,
} from '../calendar';
import CalendarToolbar from './CalendarToolbar';
import SlotCalendar from './SlotCalendar';
import { subscribeToApprovedSlots, getLeaves } from '../firebase/slotsService';

// No props. Always uses current system date - loads approved slots for calendar.
function WeekCalendar() {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [events, setEvents] = useState([]);
  const [leaveDates, setLeaveDates] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToApprovedSlots((approvedEvents) => {
      setEvents(approvedEvents);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getLeaves().then((list) => setLeaveDates(list.map((l) => l.date).filter(Boolean)));
  }, []);

  const weekEnd = useMemo(() => {
    const days = getWeekDays(weekStart, 6);
    return days[days.length - 1];
  }, [weekStart]);

  const rangeLabel = useMemo(
    () => formatWeekRangeLabel(weekStart, weekEnd),
    [weekStart, weekEnd],
  );
  const todaysSlotsCount = useMemo(
    () =>
      events.filter((event) => {
        const eventDate = parseISOToDate(event.start);
        return isSameDay(eventDate, today);
      }).length,
    [today, events],
  );

  const weeklySlotsCount = useMemo(
    () =>
      events.filter((event) => {
        const eventDate = parseISOToDate(event.start);
        return eventDate >= weekStart && eventDate <= weekEnd;
      }).length,
    [weekStart, weekEnd, events],
  );

  const weekEvents = useMemo(
    () =>
      events.filter((event) => {
        const eventDate = parseISOToDate(event.start);
        return eventDate >= weekStart && eventDate <= weekEnd;
      }),
    [weekStart, weekEnd, events],
  );

  const handleToday = () => setWeekStart(getWeekStart(new Date()));

  const handleNextWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 7);
      return next;
    });
  };

  return (
    <>
      <div className="mt-3">
        <CalendarToolbar
          today={today}
          rangeLabel={rangeLabel}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
          todaysSlotsCount={todaysSlotsCount}
          weeklySlotsCount={weeklySlotsCount}
        />
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[720px]">
          <SlotCalendar
            today={today}
            weekStart={weekStart}
            events={weekEvents}
            leaveDates={leaveDates}
          />
        </div>
      </div>
    </>
  );
}

export default WeekCalendar;
