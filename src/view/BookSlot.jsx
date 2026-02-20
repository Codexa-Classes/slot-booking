import React, { useState, useRef } from 'react';
import { CalendarIcon } from '@heroicons/react/24/solid';

export default function BookSlot({ onClose, onOpenAddHR, hrList = [] }) {
  const [form, setForm] = useState({
    date: '',
    hour: '',
    minute: '00',
    duration: '',
    round: '',
    hr: '',
  });
  const dateRef = useRef(null);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      // Auto-update AM/PM based on hour selection
      if (name === 'hour' && value) {
        const hourNum = parseInt(value, 10);
        // AM/PM will be calculated dynamically in render
      }
      return updated;
    });
  };

  // Calculate AM/PM based on selected hour
  const getAmPm = () => {
    if (!form.hour) return 'AM';
    const hourNum = parseInt(form.hour, 10);
    return hourNum >= 12 ? 'PM' : 'AM';
  };

  // Format date for shortcuts
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateShortcut = (type) => {
    const today = new Date();
    let targetDate;

    if (type === 'today') {
      targetDate = today;
    } else if (type === 'tomorrow') {
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() + 1);
    } else if (type === 'next2') {
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() + 2);
    } else if (type === 'next3') {
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() + 3);
    }

    if (targetDate) {
      setForm((f) => ({ ...f, date: formatDateForInput(targetDate) }));
    }
  };

  // HR search state for searchable dropdown
  const [hrQuery, setHrQuery] = useState('');
  const [showHrDropdown, setShowHrDropdown] = useState(false);
  const selectedHR = hrList.find((h) => String(h.id) === String(form.hr));
  const filteredHR = hrList.filter((h) => {
    if (!hrQuery) return true;
    const q = hrQuery.toLowerCase();
    return (h.name || '').toLowerCase().includes(q) || (h.company || '').toLowerCase().includes(q);
  });

  const checkAvailability = () => {
    const ok = validate(['date', 'hour', 'minute', 'duration']);
    if (!ok) return;
    // eslint-disable-next-line no-alert
    alert('Availability checked for ' + form.date + ' at ' + (form.hour && form.minute ? `${form.hour}:${form.minute}` : ''));
  };

  const bookSlot = () => {
    const ok = validate(['date', 'hour', 'minute', 'duration', 'round', 'hr']);
    if (!ok) return;
    // eslint-disable-next-line no-alert
    alert('Booking slot: ' + JSON.stringify(form));
    if (onClose) onClose();
  };

  function isTimeInRange(hour, minute, min = '11:00', max = '19:00') {
    if (!hour || minute == null) return false;
    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    const time = `${hh}:${mm}`;
    return time >= min && time <= max;
  }

  function validate(fields = []) {
    const e = {};
    const require = (name) => {
      if (!form[name]) e[name] = 'This field is required';
    };

    fields.forEach((f) => {
      if (f === 'hour' || f === 'minute') {
        // require both hour and minute if either is in the list
        if (!form.hour) e.hour = 'Hour is required';
        if (!form.minute) e.minute = 'Minute is required';
        if (form.hour && form.minute && !isTimeInRange(form.hour, form.minute)) {
          e.time = 'Time must be between 11:00 and 19:00';
        }
      } else {
        require(f);
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="w-full">
      {/* full-page width wrapper with comfortable side padding */}
      <div className="w-full px-6 lg:px-12 mt-8">
        <div className="relative bg-white rounded-lg border border-gray-100 shadow-lg px-6 py-6 md:px-10 md:py-8 w-full">
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mr-4"
            >
              ‹
            </button>
            <h2 className="mx-auto text-purple-600 font-semibold text-sm md:text-base">Book Slot</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* COLUMN 1 (Left) */}
            <div className="flex flex-col gap-3">
              {/* Date field */}
              <div>
                <label className="block text-xs font-medium text-gray-600">* Date</label>
                <div className="mt-1">
                  {/* Desktop: input with native calendar icon */}
                  <div className="hidden sm:block relative w-full">
                    <input
                      ref={dateRef}
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-md pl-3 pr-3 py-2 text-sm h-9 placeholder-gray-400"
                    />
                  </div>
                  {/* Mobile: tap-to-open with icon */}
                  <div className="sm:hidden relative w-full">
                    <button
                      type="button"
                      className="w-full text-left border border-gray-200 rounded-md pl-3 pr-10 py-2 text-sm h-9 bg-white"
                      onClick={() => setShowMobileCalendar(true)}
                    >
                      {form.date ? new Date(form.date).toLocaleDateString() : 'mm/dd/yyyy'}
                    </button>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <CalendarIcon className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                {/* Quick date links - now clickable */}
                <div className="mt-2 text-xs text-purple-600 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => handleDateShortcut('today')}
                    className="text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    Today
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDateShortcut('tomorrow')}
                    className="text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateShortcut('next2')}
                    className="text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    In 2 days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateShortcut('next3')}
                    className="text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    In 3 days
                  </button>
                </div>
              </div>

              {/* Round dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-600">* Round</label>
                <select
                  name="round"
                  value={form.round}
                  onChange={handleChange}
                  className="mt-1 md:w-56 w-full border border-gray-200 rounded-md px-3 py-2 text-sm h-9"
                >
                  <option value="">Select Round</option>
                  <option>Round 1</option>
                  <option>Round 2</option>
                </select>
                {errors.round && <p className="text-xs text-red-500 mt-1">{errors.round}</p>}
              </div>
            </div>

            {/* COLUMN 2 (Middle) */}
            <div className="flex flex-col gap-3">
              {/* Start Time */}
              <div>
                <label className="block text-xs font-medium text-gray-600">* Start Time</label>
                <div className="mt-1 flex gap-2 items-center">
                  <select
                    name="hour"
                    value={form.hour}
                    onChange={handleChange}
                    className="w-20 border border-gray-200 rounded-md px-3 py-2 text-sm h-9"
                  >
                    <option value="">Hour</option>
                    {Array.from({ length: 9 }).map((_, i) => {
                      const hh = 11 + i; // 11..19
                      const displayHour = hh % 12 === 0 ? 12 : hh % 12;
                      const ampm = hh < 12 ? 'AM' : 'PM';
                      return (
                        <option key={hh} value={String(hh).padStart(2, '0')}>
                          {displayHour} {ampm}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    name="minute"
                    value={form.minute}
                    onChange={handleChange}
                    className="w-20 border border-gray-200 rounded-md px-3 py-2 text-sm h-9"
                  >
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>

                  {/* AM/PM indicator box (dynamic) */}
                  <div className="w-12 h-9 border border-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500 bg-gray-50">
                    {getAmPm()}
                  </div>
                </div>
                {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
                {errors.hour && <p className="text-xs text-red-500 mt-1">{errors.hour}</p>}
                {errors.minute && <p className="text-xs text-red-500 mt-1">{errors.minute}</p>}
                <p className="text-xs text-red-500 mt-1">Book slots between 11 AM to 7 PM</p>
              </div>

              {/* Select HR + Add New HR (same row) */}
              <div>
                <label className="block text-xs font-medium text-gray-600">* Select HR</label>
                <div className="mt-1 flex items-center gap-3">
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="text"
                      name="hr_search"
                      value={showHrDropdown ? hrQuery : selectedHR ? selectedHR.name : hrQuery}
                      onChange={(e) => {
                        setHrQuery(e.target.value);
                        setShowHrDropdown(true);
                      }}
                      onFocus={() => setShowHrDropdown(true)}
                      placeholder="Click to select HR"
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm h-9"
                    />
                    {showHrDropdown && (
                    <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-auto z-20">
                      {filteredHR.length > 0 ? (
                        filteredHR.map((h) => (
                          <li
                            key={h.id}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                            onMouseDown={(ev) => {
                              // onMouseDown to prevent input blur before click
                              ev.preventDefault();
                              setForm((f) => ({ ...f, hr: h.id }));
                              setHrQuery('');
                              setShowHrDropdown(false);
                            }}
                          >
                            <div>
                              <div className="text-sm font-medium text-gray-800">{h.name}</div>
                              <div className="text-xs text-gray-500">{h.company}</div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-sm text-gray-600">
                          No HR found.
                          <button
                            type="button"
                            onMouseDown={(ev) => {
                              ev.preventDefault();
                              setShowHrDropdown(false);
                              onOpenAddHR();
                            }}
                            className="ml-2 text-purple-600 underline"
                          >
                            Create new HR
                          </button>
                        </li>
                      )}
                    </ul>
                    )}
                  </div>
                  <button type="button" onClick={onOpenAddHR} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-purple-100 text-purple-700 text-sm h-9 flex-shrink-0">
                    + Add New HR
                  </button>
                </div>

                {errors.hr && <p className="text-xs text-red-500 mt-1">{errors.hr}</p>}
                {/* helper text */}
                <div className="mt-1">
                  <p className="text-xs text-red-500">• Create new HR if not listed.</p>
                  <p className="text-xs text-green-600">• Search HR name or Company name.</p>
                </div>
              </div>
            </div>

            {/* COLUMN 3 (Right) - Meeting Duration + Check Availability same row, then Book My Slot */}
            <div className="flex flex-col gap-3 h-full">
              {/* Meeting Duration (left) + Check Availability (right) - same row as in screenshot */}
              <div className="flex items-end justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-gray-600">* Meeting Duration</label>
                  <select name="duration" value={form.duration} onChange={handleChange} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm h-9">
                    <option value="">Select Duration</option>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="120">2 Hours</option>
                    <option value="180">3 Hours</option>
                    <option value="240">4 Hours</option>
                  </select>
                  {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
                </div>
                <button
                  type="button"
                  onClick={checkAvailability}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-200 hover:bg-yellow-300 text-sm h-9 flex-shrink-0"
                >
                  Check Availability
                </button>
              </div>

              {/* Book button bottom-right */}
              <div className="mt-auto flex justify-end">
                <button
                  type="button"
                  onClick={bookSlot}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded bg-emerald-400 hover:bg-emerald-500 text-white font-semibold h-9 md:w-36 justify-center"
                >
                  Book My Slot
                </button>
              </div>
            </div>
          </div>

          {/* (removed duplicate mobile book button - layout now uses the grid above) */}

          {/* Desktop corner buttons removed to avoid duplicates; using in-grid controls instead */}

          {/* Mobile full-screen calendar modal (kept inside card wrapper) */}
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
                    value={form.date}
                    onChange={(e) => {
                      handleChange(e);
                    }}
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
      </div>
    </div>
  );
}

