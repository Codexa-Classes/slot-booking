import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './Components/Header';
import CalendarToolbar from './Components/CalendarToolbar';
import SlotCalendar from './Components/SlotCalendar';
import Login from './view/Login';
import CandidateDashboard from './view/CandidateDashboard';
import {
  FIXED_TODAY,
  getWeekStart,
  formatWeekRangeLabel,
  getWeekDays,
  parseISOToDate,
  isSameDay,
} from './calendar';

// Static mock events (slots)
const MOCK_EVENTS = [
  {
    title: 'Slot Booked',
    start: '2026-02-03T11:00:00',
    end: '2026-02-03T12:00:00',
  },
  {
    title: 'Slot Booked',
    start: '2026-02-04T15:00:00',
    end: '2026-02-04T16:00:00',
  },
  {
    title: 'Slot Booked',
    start: '2026-02-06T13:00:00',
    end: '2026-02-06T14:00:00',
  },
];

function App() {
  const [weekStart, setWeekStart] = useState(getWeekStart(FIXED_TODAY));

  const weekEnd = useMemo(() => {
    const days = getWeekDays(weekStart, 6);
    return days[days.length - 1];
  }, [weekStart]);

  const rangeLabel = useMemo(
    () => formatWeekRangeLabel(weekStart, weekEnd),
    [weekStart, weekEnd],
  );

  const todaysSlotsCount = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      const eventDate = parseISOToDate(event.start);
      return isSameDay(eventDate, FIXED_TODAY);
    }).length;
  }, []);

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const handleToday = () => {
    setWeekStart(getWeekStart(FIXED_TODAY));
  };

  const CalendarPage = () => (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased">
      <Header todaysSlotsCount={todaysSlotsCount} />

      <main className="mx-auto mt-2 sm:mt-4 max-w-6xl px-2 sm:px-4 pb-6 sm:pb-10">
        <div className="overflow-hidden rounded-lg sm:rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CalendarToolbar
            rangeLabel={rangeLabel}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onToday={handleToday}
            todaysSlotsCount={todaysSlotsCount}
          />
          <SlotCalendar weekStart={weekStart} events={MOCK_EVENTS} />
        </div>
      </main>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<CandidateDashboard />} />
        <Route path="/" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
