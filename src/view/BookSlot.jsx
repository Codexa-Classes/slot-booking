import React, { useState, useRef } from 'react';
import { CalendarIcon } from '@heroicons/react/24/solid';

export default function BookSlot({ onClose, onOpenAddHR }) {
  const [form, setForm] = useState({
    date: '',
    hour: '',
    minute: '00',
    duration: '',
    round: '',
    hr: '',
  });
  const dateRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

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
      <div className="max-w-6xl mx-auto mt-8">
        <div className="relative bg-white rounded-lg border border-gray-100 shadow-lg px-6 py-6 md:px-10 md:py-8">
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

          <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-12 md:col-span-5 lg:col-span-5">
                <label className="block text-xs font-medium text-gray-600">* Date</label>
                <div className="mt-1 relative">
                  <input
                    ref={dateRef}
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm h-9 placeholder-gray-400 pr-10 appearance-none"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield', appearance: 'none' }}
                  />
                  <button
                    type="button"
                    aria-label="Open date picker"
                    onClick={() => dateRef.current && dateRef.current.focus()}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-purple-600 flex gap-3">
                  <button type="button" className="text-purple-600">Today</button>
                  <button type="button" className="text-purple-600">Tomorrow</button>
                  <button type="button" className="text-purple-600">Feb 11</button>
                  <button type="button" className="text-purple-600">Feb 12</button>
                </div>
              </div>

              <div className="col-span-6 md:col-span-4 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-600">* Start Time</label>
                <div className="mt-1 flex gap-2">
                  <select
                    name="hour"
                    value={form.hour}
                    onChange={handleChange}
                    className="w-1/2 border border-gray-200 rounded-md px-3 py-2 text-sm h-9"
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
                    className="w-1/2 border border-gray-200 rounded-md px-3 py-2 text-sm h-9"
                  >
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                </div>
                {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
                {errors.hour && <p className="text-xs text-red-500 mt-1">{errors.hour}</p>}
                {errors.minute && <p className="text-xs text-red-500 mt-1">{errors.minute}</p>}
                <p className="text-xs text-red-500 mt-1">Book slots between 11 AM to 7 PM</p>
              </div>

              <div className="col-span-6 md:col-span-3 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-600">* Meeting Duration</label>
                <select name="duration" value={form.duration} onChange={handleChange} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm h-9">
                  <option value="">Select Duration</option>
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
                {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
              </div>

              <div className="col-span-12 flex justify-end lg:hidden">
                <button type="button" onClick={checkAvailability} className="w-48 inline-flex items-center justify-center px-4 py-2 rounded-md bg-yellow-200 hover:bg-yellow-300 text-sm h-9">
                  Check Availability
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-12 gap-4 items-start">
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-600">* Round</label>
                <select name="round" value={form.round} onChange={handleChange} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm h-9">
                  <option value="">Select Round</option>
                  <option>Round 1</option>
                  <option>Round 2</option>
                </select>
                {errors.round && <p className="text-xs text-red-500 mt-1">{errors.round}</p>}
              </div>

              <div className="col-span-12 md:col-span-8 lg:col-span-9">
                <label className="block text-xs font-medium text-gray-600">* Select HR</label>
                <div className="mt-1 flex gap-3 items-center">
                  <select name="hr" value={form.hr} onChange={handleChange} className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm h-9">
                    <option value="">Click to select HR</option>
                  </select>
                  <button type="button" onClick={onOpenAddHR} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-purple-100 text-purple-700 text-sm h-9">
                    + Add New HR
                  </button>
                </div>
                {errors.hr && <p className="text-xs text-red-500 mt-1">{errors.hr}</p>}
                <div className="mt-1">
                  <p className="text-xs text-red-500">• Create new HR if not listed.</p>
                  <p className="text-xs text-green-600">• Search HR name or Company name.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-2">
            {/* Mobile: full width below form */}
            <div className="lg:hidden mt-4">
              <button
                type="button"
                onClick={bookSlot}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-emerald-400 hover:bg-emerald-500 text-white font-semibold h-9"
              >
                Book My Slot
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: absolute positioned Check and Book buttons at card corners */}
        <div className="hidden lg:block absolute right-6 top-1/2 transform -translate-y-1/2">
          <button
            type="button"
            onClick={checkAvailability}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-200 hover:bg-yellow-300 text-sm h-9"
          >
            Check Availability
          </button>
        </div>

        <div className="hidden lg:block absolute right-6 bottom-6">
          <button
            type="button"
            onClick={bookSlot}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-400 hover:bg-emerald-500 text-white font-semibold h-9"
          >
            Book My Slot
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

