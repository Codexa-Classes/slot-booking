import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './Components/Header';
import CalendarToolbar from './Components/CalendarToolbar';
import SlotCalendar from './Components/SlotCalendar';
import Login from './view/Login';
import CandidateDashboard from './view/CandidateDashboard';
import MySlots from './view/MySlots';
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
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);

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
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased pt-16">
      <Header todaysSlotsCount={todaysSlotsCount} fullWidth />

      <main className="w-full mt-4 px-4 pb-6 sm:pb-10">
        <div className="min-h-[70vh] overflow-hidden rounded-lg sm:rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-6">
          <CalendarToolbar
            rangeLabel={rangeLabel}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onToday={handleToday}
            todaysSlotsCount={todaysSlotsCount}
            onOpenMobileCalendar={() => setShowMobileCalendar(true)}
          />
          <div className="mt-4">
            <SlotCalendar weekStart={weekStart} events={MOCK_EVENTS} />
          </div>
        </div>
      </main>
      {showMobileCalendar && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-sm font-semibold">Select date</h3>
              <button
                onClick={() => setShowMobileCalendar(false)}
                className="px-3 py-1 rounded bg-gray-100"
              >
                Close
              </button>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center">
              <input
                type="date"
                className="w-full max-w-md border border-gray-200 rounded-md p-3 text-lg"
              />
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowMobileCalendar(false)}
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded bg-purple-600 text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<CandidateDashboard />} />
        <Route path="/dashboard/slots" element={<MySlots />} />
        <Route path="/" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
