import React, { useState } from 'react';
import { CalendarIcon, CloudArrowDownIcon } from '@heroicons/react/24/solid';
import Navbar from '../Components/Navbar';
import AddHRModal from '../Components/AddHRModal';
import BookSlot from './BookSlot';

// Header Component
function Header() {
  return (
    <div className="bg-pink-100 px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 flex items-center justify-between gap-2 sm:gap-3">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">V</span>
        </div>
        <h1 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 truncate">Slot Booking</h1>
      </div>

      {/* Center Section - Hidden on mobile */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-gray-600">virajkadam.in</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 truncate">Poonam Digole</p>
          <p className="text-[10px] sm:text-xs text-gray-500">Candidate</p>
        </div>
        <div className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-xs sm:text-sm md:text-base font-semibold text-white">PD</span>
        </div>
      </div>
    </div>
  );
}

<Navbar />

// Slot Card Component
function SlotCard({ title, time }) {
  return (
    <div className="bg-blue-500 text-white rounded-lg p-2 sm:p-3 text-center shadow-md">
      <p className="font-semibold text-xs sm:text-sm">{title}</p>
      <p className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">{time}</p>
    </div>
  );
}

// Calendar Grid Component
function CalendarGrid({ showAddHR, onOpenAddHR, onCloseAddHR, onOpenBookSlot }) {
  const timeSlots = [
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
  ];

  const days = [
    { name: 'Monday, Feb 2', date: 2 },
    { name: 'Tuesday, Feb 3', date: 3 },
    { name: 'Wednesday, Feb 4', date: 4 },
    { name: 'Thursday, Feb 5', date: 5, isToday: true },
    { name: 'Friday, Feb 6', date: 6 },
    { name: 'Saturday, Feb 7', date: 7 },
  ];

  // Slot data structure: { day: date, time: index, title: string, timeRange: string }
  const booked = [
    { day: 3, times: [0], title: 'Slot Booked', timeRange: '11:00 AM - 12:00 PM' },
    { day: 3, times: [1], title: 'Slot Booked', timeRange: '12:00 PM - 01:00 PM' },
    { day: 3, times: [2], title: 'Slot Booked', timeRange: '01:00 PM - 02:00 PM' },
    { day: 3, times: [3], title: 'Slot Booked', timeRange: '02:00 PM - 03:00 PM' },
    { day: 3, times: [4], title: 'Slot Booked', timeRange: '03:30 PM - 04:30 PM' },
    { day: 3, times: [5], title: 'Slot Booked', timeRange: '05:00 PM - 06:00 PM' },
    
    { day: 4, times: [4], title: 'Slot Booked', timeRange: '03:00 PM - 04:00 PM' },
    { day: 4, times: [5], title: 'Slot Booked', timeRange: '04:00 PM - 05:00 PM' },
    
    { day: 5, times: [4], title: 'Slot Booked', timeRange: '03:00 PM - 04:00 PM' },
    { day: 5, times: [5], title: 'Slot Booked', timeRange: '04:00 PM - 05:00 PM' },
    
    { day: 6, times: [4], title: 'Slot Booked', timeRange: '03:00 PM - 04:00 PM' },
  ];

  const isSlotBooked = (dayDate, timeIndex) => {
    return booked.some((slot) => slot.day === dayDate && slot.times.includes(timeIndex));
  };

  const getSlot = (dayDate, timeIndex) => {
    return booked.find((slot) => slot.day === dayDate && slot.times.includes(timeIndex));
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl shadow-md overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4 md:p-6">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex flex-col items-start justify-between gap-3 mb-3">
            {/* Left - Today Info */}
            <div className="flex items-center gap-2 text-xs sm:text-sm w-full">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
              <span className="text-gray-700 font-medium hidden sm:inline">Today: Thu, 5 Feb 2026</span>
              <span className="text-gray-700 font-medium sm:hidden">Thu, 5 Feb</span>
            </div>

            {/* Center - Title */}
            <h2 className="text-lg sm:text-xl font-bold text-purple-600 w-full">
              Slot Booking Calendar
            </h2>

            {/* Right - Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full">
              {/* Download link - place the PDF file in public/ with this filename:
                  public/interview_process_candidate_details.pdf */}
              <a
                href="/interview_process_candidate_details.pdf"
                download="Personal_Detail_Form.pdf"
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1 flex-shrink-0 inline-flex"
              >
                <CloudArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">Personal Detail Form</span>
              </a>
              <button
                onClick={onOpenAddHR}
                className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0"
              >
                <span className="hidden sm:inline">+ Add New HR</span>
                <span className="sm:hidden">+ HR</span>
              </button>
              <button
                onClick={onOpenBookSlot}
                className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0"
              >
                <span className="hidden sm:inline">+ Book New Slot</span>
                <span className="sm:hidden">+ Slot</span>
              </button>
            </div>
          </div>

          {/* Date Range Below */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="bg-gray-900 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm">›</button>
              <button className="border border-purple-300 text-purple-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium">
                today
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Feb 2 – 7, 2026</h3>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between gap-6 mb-6">
            {/* Left - Today Info */}
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-gray-600" />
              <span className="text-gray-700 font-medium">Today: Thu, 5 Feb 2026</span>
            </div>

            {/* Center - Title */}
            <h2 className="text-2xl font-bold text-purple-600">
              Slot Booking Calendar
            </h2>

            {/* Right - Action Buttons */}
            <div className="flex gap-3">
              {/* Desktop download link - ensure file is in public/ */}
              <a
                href="/interview_process_candidate_details.pdf"
                download="Personal_Detail_Form.pdf"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 whitespace-nowrap inline-flex"
              >
                <CloudArrowDownIcon className="w-4 h-4" />
                Download Personal Detail Form
              </a>
              <button
                onClick={onOpenAddHR}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                + Add New HR
              </button>
              <button
                onClick={onOpenBookSlot}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                + Book New Slot
              </button>
            </div>
          </div>

          {/* Date Range Below */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm">›</button>
              <button className="border border-purple-300 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium">
                today
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Feb 2 – 7, 2026</h3>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm font-semibold text-gray-600 w-14 sm:w-20 md:w-24"></td>
              {days.map((day) => (
                <td
                  key={day.date}
                  className={`p-2 sm:p-3 md:p-4 text-center font-semibold text-xs sm:text-sm border-l border-gray-200 ${
                    day.isToday ? 'bg-yellow-50 text-gray-900' : 'text-gray-900'
                  }`}
                >
                  <span className="hidden sm:inline">{day.name}</span>
                  <span className="sm:hidden block text-[10px]">{day.name.split(',')[0]}</span>
                  <span className="sm:hidden block text-[9px] text-gray-600">Feb {day.date}</span>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, timeIndex) => (
              <tr key={time} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm text-gray-600 font-medium sticky left-0 bg-white z-10">{time}</td>
                {days.map((day) => (
                  <td
                    key={`${day.date}-${time}`}
                    className={`p-2 sm:p-3 md:p-3 border-l border-gray-200 align-top min-h-20 sm:min-h-24 ${
                      day.isToday ? 'bg-yellow-50' : 'bg-white'
                    }`}
                  >
                    {isSlotBooked(day.date, timeIndex) && (
                      <SlotCard
                        title={getSlot(day.date, timeIndex).title}
                        time={getSlot(day.date, timeIndex).timeRange}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddHRModal isOpen={showAddHR} onClose={onCloseAddHR} onAdd={() => {}} />
    </div>
  );
}

// Main Dashboard Component
export default function CandidateDashboard() {
  const [showAddHR, setShowAddHR] = useState(false);
  const [showBookSlot, setShowBookSlot] = useState(false);

  // HR list shared state
  const [hrList, setHrList] = useState([
    { id: 1, name: 'Poonam Digole', email: '', technology: 'React', mobile: '', jobType: 'onsite', company: 'Acme' },
  ]);

  const handleAddHR = (hr) => {
    setHrList((prev) => [...prev, hr]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar onOpenAddHR={() => setShowAddHR(true)} />
      <main className="p-2 sm:p-4 md:p-8">
        {showBookSlot ? (
          // lazy load BookSlot component to keep file smaller
          <BookSlot onClose={() => setShowBookSlot(false)} onOpenAddHR={() => setShowAddHR(true)} hrList={hrList} />
        ) : (
          <CalendarGrid
            showAddHR={showAddHR}
            onOpenAddHR={() => setShowAddHR(true)}
            onCloseAddHR={() => setShowAddHR(false)}
            onOpenBookSlot={() => setShowBookSlot(true)}
          />
        )}
      </main>
      <AddHRModal isOpen={showAddHR} onClose={() => setShowAddHR(false)} onAdd={handleAddHR} />
    </div>
  );
}
