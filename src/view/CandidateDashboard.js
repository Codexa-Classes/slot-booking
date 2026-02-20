import React, { useMemo, useState, useEffect } from 'react';
import { CalendarIcon, CloudArrowDownIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import Navbar from '../Components/Navbar';
import AddHRModal from '../Components/AddHRModal';
import BookSlot from './BookSlot';
import WeekCalendar from '../Components/WeekCalendar';
import { db } from '../firebase/firebase';
import { formatDayHeader } from '../calendar';
import { useAuth } from '../context/AuthContext';

// Placeholder events for future dynamic data (no fixed dates)
const MOCK_EVENTS = [];

function getInitials(name) {
  const cleaned = String(name || '').trim();
  if (!cleaned) return 'C';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
  return (first + last).toUpperCase() || 'C';
}

// Header Component
function Header({ userName, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = useMemo(() => getInitials(userName), [userName]);

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
      <div className="relative flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 truncate">
              {userName || 'Candidate'}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">Candidate</p>
          </div>
          <div className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xs sm:text-sm md:text-base font-semibold text-white">
              {initials}
            </span>
          </div>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 w-40 rounded-xl bg-white shadow-lg border border-slate-100 z-50 overflow-hidden">
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">
                {userName || 'Candidate'}
              </p>
              <p className="text-[11px] text-slate-500">Candidate</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onLogout?.();
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Candidate calendar area: uses WeekCalendar; header shows current system date only
function CandidateCalendarArea({ onOpenAddHR, onOpenBookSlot }) {
  const headerDate = new Date();

  const dayHeader = formatDayHeader(headerDate);
  const todayFormatted = `${dayHeader.weekday.slice(0, 3)}, ${headerDate.getDate()} ${dayHeader.label.split(', ')[1]} ${headerDate.getFullYear()}`;

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl shadow-md overflow-hidden border border-slate-200">
      {/* Title + candidate actions (Download, Add HR, Book Slot) */}
      <div className="border-b border-slate-200 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 relative">
          {/* Left: Calendar icon + Today's date */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">
              Today: {todayFormatted}
            </span>
          </div>

          {/* Center: Title (centered) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 whitespace-nowrap">
              Slot Booking Calendar
            </h2>
          </div>

          {/* Right: Action buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 ml-auto">
            <a
              href="/interview_process_candidate_details.pdf"
              download="Personal_Detail_Form.pdf"
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1 inline-flex"
            >
              <CloudArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Download Personal Detail Form</span>
              <span className="sm:hidden">Download</span>
            </a>
            <button
              type="button"
              onClick={onOpenAddHR}
              className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
            >
              + Add New HR
            </button>
            <button
              type="button"
              onClick={onOpenBookSlot}
              className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
            >
              + Book New Slot
            </button>
          </div>
        </div>

        <WeekCalendar />
      </div>
    </div>
  );
}

// My Slots Component - shows user's booked slots
function MySlots({ onBookNewSlot, onBackToHome }) {
  const { currentUser } = useAuth();
  const [slots, setSlots] = useState([]);
  const [slotSearch, setSlotSearch] = useState('');

  useEffect(() => {
    let storedId = '';
    try {
      const raw = localStorage.getItem('sb_user');
      const parsed = raw ? JSON.parse(raw) : null;
      storedId = String(parsed?.mobile || '').trim();
    } catch {
      storedId = '';
    }

    const candidateId = storedId || currentUser?.uid;
    if (!candidateId) return;

    const q = query(
      collection(db, 'slots'),
      where('candidateId', '==', candidateId),
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setSlots(items);
    });
    return () => unsub();
  }, [currentUser]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const totalSlots = slots.length;

  const filteredSlots = useMemo(() => {
    if (!slotSearch.trim()) return slots;
    const q = slotSearch.toLowerCase();
    return slots.filter((slot) => {
      return (
        String(slot.companyName || '').toLowerCase().includes(q) ||
        String(slot.technology || '').toLowerCase().includes(q)
      );
    });
  }, [slots, slotSearch]);

  const formatTimeLabel = (timeStr, durationStr) => {
    if (!timeStr) return '';
    const [hh, mm] = timeStr.split(':').map((v) => parseInt(v, 10));
    if (Number.isNaN(hh) || Number.isNaN(mm)) return timeStr;
    const dur = parseInt(durationStr, 10);
    const start = new Date();
    start.setHours(hh, mm, 0, 0);
    const opts = { hour: 'numeric', minute: '2-digit' };
    const startLabel = start.toLocaleTimeString(undefined, opts);
    if (!dur || Number.isNaN(dur)) return startLabel;
    const end = new Date(start.getTime() + dur * 60000);
    const endLabel = end.toLocaleTimeString(undefined, opts);
    let durLabel;
    if (dur % 60 === 0) {
      const hours = dur / 60;
      durLabel = `${hours} Hour${hours === 1 ? '' : 's'}`;
    } else {
      durLabel = `${dur} mins`;
    }
    return `${startLabel} - ${endLabel} (${durLabel})`;
  };

  const handleDeleteSlot = async (id) => {
    try {
      await deleteDoc(doc(db, 'slots', id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete slot:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
      {/* Header: back button left, title centered, Book New Slot button right */}
      <div className="flex items-center justify-between mb-4 gap-3">
        {/* Left: back button */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-400 text-white shadow-sm hover:bg-slate-500"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Center: title */}
        <div className="flex-1 text-center">
          <h2 className="text-sm sm:text-base font-semibold text-purple-600">
            My Slots
          </h2>
        </div>

        {/* Right: Book New Slot button */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBookNewSlot}
            className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-green-600 whitespace-nowrap"
          >
            <span className="text-lg">+</span>
            <span>Book New Slot</span>
          </button>
        </div>
      </div>

      {/* Metrics + search row */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-700">
          <div className="flex flex-col items-center">
            <span className="text-sm sm:text-base font-semibold text-slate-800">
              {totalSlots}
            </span>
            <span className="text-[11px] text-slate-500">Total Slots</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <div className="relative w-32 sm:w-40">
            <input
              type="text"
              placeholder="Search slots..."
              value={slotSearch}
              onChange={(e) => setSlotSearch(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white pl-3 pr-3 py-1.5 text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>
      </div>

      {/* Table content */}
      {filteredSlots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <p className="text-sm sm:text-base text-gray-500">No slots found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="px-3 py-2 text-left font-semibold border-b border-slate-200 w-10">
                  Sr.No
                </th>
                <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                  Company Name
                </th>
                <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                  Technology
                </th>
                <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                  Round
                </th>
                <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                  Date
                </th>
                <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                  Time
                </th>
                <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                  Feedback
                </th>
                <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSlots.map((slot, index) => {
                const isToday = slot.date === todayStr;
                let displayDate = '';
                try {
                  displayDate = slot.date
                    ? new Date(slot.date).toLocaleDateString()
                    : '';
                } catch {
                  displayDate = slot.date || '';
                }
                const timeLabel = formatTimeLabel(
                  slot.time || '',
                  slot.duration || '',
                );

                return (
                  <tr
                    key={slot.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-3 py-2 text-slate-700">{index + 1}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {slot.companyName || '-'}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {slot.technology || '-'}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {slot.round || '-'}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {displayDate}{' '}
                      {isToday && (
                        <span className="text-emerald-600 font-semibold">
                          (Today)
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {timeLabel || '-'}
                    </td>
                    <td className="px-3 py-2 text-slate-700">-</td>
                    <td className="px-3 py-2 text-slate-700">
                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="inline-flex items-center justify-center rounded bg-red-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-red-600"
                      >
                        <i className="fa-solid fa-trash" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Main Dashboard Component
export default function CandidateDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialNav = params.get('view') === 'slots' ? 'slots' : 'home';
  const [showAddHR, setShowAddHR] = useState(false);
  const [showBookSlot, setShowBookSlot] = useState(false);
  const [activeNav, setActiveNav] = useState(initialNav); // 'home', 'slots', 'hrs'
  const [userName, setUserName] = useState('');

  // HR list shared state - fetched from Firestore
  const [hrList, setHrList] = useState([]);
  const [hrsLoading, setHrsLoading] = useState(true);
  const [hrsError, setHrsError] = useState(null);

  // Fetch HRs from Firestore "hrs" collection
  useEffect(() => {
    const fetchHRs = async () => {
      try {
        setHrsLoading(true);
        setHrsError(null);
        const q = collection(db, 'hrs');
        const querySnapshot = await getDocs(q);
        const hrsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Store Firestore document ID
          name: doc.data().name || '',
          email: doc.data().email || '',
          company: doc.data().company || '',
          technology: doc.data().technology || '',
          mobile: doc.data().mobile || '',
          jobType: doc.data().jobType || '',
        }));
        setHrList(hrsData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch HRs:', err);
        setHrsError('Failed to load HR list. Please try again.');
      } finally {
        setHrsLoading(false);
      }
    };

    fetchHRs();
  }, []);

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const raw = localStorage.getItem('sb_user');
        const parsed = raw ? JSON.parse(raw) : null;
        const cachedName = (parsed?.name || '').trim();
        if (cachedName) {
          setUserName(cachedName);
          return;
        }

        const mobile = String(parsed?.mobile || '').trim();
        if (!mobile) return;

        const q = query(collection(db, 'users'), where('mobile', '==', mobile));
        const snap = await getDocs(q);
        if (snap.empty) return;

        const data = snap.docs[0].data();
        const name = String(data?.name || '').trim();
        if (!name) return;

        setUserName(name);
        localStorage.setItem(
          'sb_user',
          JSON.stringify({ ...parsed, name }),
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load candidate name:', err);
      }
    };

    loadUserName();
  }, []);

  const handleAddHR = (hr) => {
    setHrList((prev) => [...prev, hr]);
  };

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === 'hrs') {
      setShowAddHR(true);
    } else if (navId === 'home') {
      setShowBookSlot(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName={userName}
        onLogout={() => {
          localStorage.removeItem('sb_user');
          navigate('/login', { replace: true });
        }}
      />
      <Navbar 
        onOpenAddHR={() => {
          setActiveNav('hrs');
          setShowAddHR(true);
        }}
        onNavChange={handleNavClick}
        activeNav={activeNav}
      />
      <main className="p-2 sm:p-4 md:p-8">
        {showBookSlot ? (
          <BookSlot onClose={() => setShowBookSlot(false)} onOpenAddHR={() => setShowAddHR(true)} hrList={hrList} />
        ) : activeNav === 'slots' ? (
          <MySlots 
            onBookNewSlot={() => setShowBookSlot(true)} 
            onBackToHome={() => setActiveNav('home')}
          />
        ) : (
          <CandidateCalendarArea
            onOpenAddHR={() => {
              setActiveNav('hrs');
              setShowAddHR(true);
            }}
            onOpenBookSlot={() => setShowBookSlot(true)}
          />
        )}
      </main>

      {/* Add New HR modal (opens only when showAddHR=true) */}
      <AddHRModal
        isOpen={showAddHR}
        onClose={() => {
          setShowAddHR(false);
          if (activeNav === 'hrs') {
            setActiveNav('home');
          }
        }}
        onAdd={handleAddHR}
      />
    </div>
  );
}
