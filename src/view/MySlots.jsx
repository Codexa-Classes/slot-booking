import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import AddHRModal from '../Components/AddHRModal';

// Reuse the same style header as CandidateDashboard
function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('touchstart', onDown);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('touchstart', onDown);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    navigate('/login');
  };

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

      {/* Right Section - profile dropdown */}
      <div className="relative ml-auto" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 sm:gap-3 md:gap-4"
        >
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 truncate">Poonam Digole</p>
            <p className="text-[10px] sm:text-xs text-gray-500">Candidate</p>
          </div>
          <div className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xs sm:text-sm md:text-base font-semibold text-white">PD</span>
          </div>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-60 rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden z-50">
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-white">PD</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">Poonam Digole</p>
                <p className="text-xs text-gray-500">Candidate</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 text-sm"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MySlots() {
  const navigate = useNavigate();
  const [showAddHR, setShowAddHR] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar
        initialActive="slots"
        onOpenAddHR={() => setShowAddHR(true)}
        onSelectHome={() => navigate('/dashboard')}
        onSelectSlots={() => navigate('/dashboard/slots')}
      />

      <main className="p-2 sm:p-4 md:p-8">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-xl text-gray-500 hover:text-gray-700"
              aria-label="Back"
            >
              ‹
            </button>
            <h2 className="text-sm sm:text-base font-semibold text-purple-600">My Slots</h2>
            <button
              type="button"
              onClick={() => navigate('/dashboard?view=book')}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold"
            >
              + Book New Slot
            </button>
          </div>

          <div className="px-4 sm:px-6 py-10 text-center text-gray-500 text-sm">
            No slots found
          </div>
        </div>
      </main>

      <AddHRModal
        isOpen={showAddHR}
        onClose={() => setShowAddHR(false)}
        onAdd={() => {}}
      />
    </div>
  );
}

