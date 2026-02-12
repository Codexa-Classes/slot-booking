import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import SlotCalendar from '../Components/SlotCalendar';
import CalendarToolbar from '../Components/CalendarToolbar';
import { adminLogout } from './AdminLogin';
import {
  FIXED_TODAY,
  getWeekStart,
  getWeekDays,
  formatWeekRangeLabel,
  parseISOToDate,
  isSameDay,
} from '../calendar';

// Header copied from CandidateDashboard, adjusted for Admin
function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="bg-pink-100 px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 flex items-center justify-between gap-2 sm:gap-3">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">V</span>
        </div>
        <h1 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 truncate">
          Slot Booking
        </h1>
      </div>

      {/* Center Section - Hidden on mobile */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-gray-600">virajkadam.in</p>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 truncate">
              Viraj Kadam
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">Admin</p>
          </div>
          <div className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
            <span className="text-xs sm:text-sm md:text-base font-semibold text-white">VK</span>
          </div>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 w-40 rounded-xl bg-white shadow-lg border border-slate-100 z-50 overflow-hidden">
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Viraj Kadam</p>
              <p className="text-[11px] text-slate-500">Admin</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
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

// Top navigation row like screenshot
function AdminTopNav({ activeTab, onChange }) {
  const baseBtn =
    'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all';

  return (
    <div className="bg-white px-3 sm:px-6 py-2 flex items-center gap-2 shadow-sm border-b border-purple-100">
      {/* Home - active */}
      <button
        onClick={() => onChange('home')}
        className={`${baseBtn} ${
          activeTab === 'home'
            ? 'bg-purple-100 text-purple-600 shadow-sm'
            : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        <HomeIcon className="w-4 h-4" />
        <span>Home</span>
      </button>

      {/* Candidates */}
      <button
        onClick={() => onChange('candidates')}
        className={`${baseBtn} ${
          activeTab === 'candidates'
            ? 'bg-purple-100 text-purple-600 shadow-sm'
            : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        <UsersIcon className="w-4 h-4" />
        <span>Candidates</span>
      </button>

      {/* Slots */}
      <button
        onClick={() => onChange('slots')}
        className={`${baseBtn} ${
          activeTab === 'slots'
            ? 'bg-purple-100 text-purple-600 shadow-sm'
            : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        <CalendarIcon className="w-4 h-4" />
        <span>Slots</span>
      </button>

      {/* Admin Leaves */}
      <button
        onClick={() => onChange('leaves')}
        className={`${baseBtn} ${
          activeTab === 'leaves'
            ? 'bg-purple-100 text-purple-600 shadow-sm'
            : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        <CalendarIcon className="w-4 h-4" />
        <span>Admin Leaves</span>
      </button>

      {/* HRs */}
      <button
        onClick={() => onChange('hrs')}
        className={`${baseBtn} ${
          activeTab === 'hrs'
            ? 'bg-purple-100 text-purple-600 shadow-sm'
            : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        <UsersIcon className="w-4 h-4" />
        <span>HRs</span>
      </button>

      {/* Statistics */}
      <button
        onClick={() => onChange('stats')}
        className={`${baseBtn} ${
          activeTab === 'stats'
            ? 'bg-purple-100 text-purple-600 shadow-sm'
            : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        <ChartBarIcon className="w-4 h-4" />
        <span>Statistics</span>
      </button>

      <div className="ml-auto hidden sm:flex items-center text-[11px] font-semibold text-slate-600">
        Pending Approvals:&nbsp;<span className="text-red-600">0</span>
      </div>
    </div>
  );
}

// Static mock events for admin calendar
const ADMIN_EVENTS = [
  {
    title: 'Slot Booked',
    start: '2026-02-09T17:00:00',
    end: '2026-02-09T18:00:00',
  },
  {
    title: 'Slot Booked',
    start: '2026-02-10T15:00:00',
    end: '2026-02-10T16:00:00',
  },
  {
    title: 'Slot Booked',
    start: '2026-02-12T15:00:00',
    end: '2026-02-12T16:00:00',
  },
];

const MOCK_CANDIDATES = [
  {
    id: 1,
    name: 'Nil',
    mobile: '9975072250',
    experience: '4',
    technologies: ['Python', 'React Developer', 'MEAN Stack'],
    totalScheduled: '4',
    lastInterview: '10 Feb 2026',
    payment: '₹0',
    regime: 'new-70',
    status: 'Active',
    selected: true,
    referredBy: 'Nilesh Sir',
  },
  {
    id: 2,
    name: 'Lalit',
    mobile: '7495915658',
    experience: '3',
    technologies: ['PHP'],
    totalScheduled: '0',
    lastInterview: '-',
    payment: '₹0',
    regime: '-',
    status: 'Active',
    selected: false,
    referredBy: 'Anil Shinde Sir',
  },
  {
    id: 3,
    name: 'Jitesh',
    mobile: '9021117830',
    experience: '4',
    technologies: ['Python', 'React Developer'],
    totalScheduled: '0',
    lastInterview: '-',
    payment: '₹0',
    regime: '-',
    status: 'Active',
    selected: false,
    referredBy: 'Vishal Sir',
  },
  {
    id: 4,
    name: 'Kiiran Shinde',
    mobile: '9876543210',
    experience: '',
    technologies: ['Python'],
    totalScheduled: '1',
    lastInterview: '11 Feb 2026',
    payment: '₹0',
    regime: 'new-70',
    status: 'Active',
    selected: false,
    referredBy: 'Viraj Kadam Sir',
  },
];

const MOCK_SLOTS = [
  {
    id: 1,
    name: 'Sanjay Kumar',
    company: 'ChZillion.Com',
    technology: 'App Support',
    round: 'Round 1',
    createdAt: '10 Feb 2026, 03:31 PM',
    dateLabel: 'Wed, 11 Feb 2026 (Tomorrow)',
    timeLabel: '05:45 PM – 06:15 PM (30 mins)',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Sanjay Kumar',
    company: 'Eclerex',
    technology: 'App Support',
    round: 'Round 1',
    createdAt: '10 Feb 2026, 02:07 PM',
    dateLabel: 'Wed, 11 Feb 2026 (Tomorrow)',
    timeLabel: '05:00 PM – 05:30 PM (30 mins)',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Mayuri Sonvane',
    company: 'Entrata Care',
    technology: 'PHP',
    round: 'Round 1',
    createdAt: '10 Feb 2026, 02:29 PM',
    dateLabel: 'Wed, 11 Feb 2026 (Tomorrow)',
    timeLabel: '04:00 PM – 05:00 PM (1 Hour)',
    status: 'Approved',
  },
  {
    id: 4,
    name: 'Kiiran Shinde',
    company: 'KPIT',
    technology: 'Python',
    round: 'Round 1',
    createdAt: '10 Feb 2026, 02:00 PM',
    dateLabel: 'Wed, 11 Feb 2026',
    timeLabel: '03:00 Pm - 03:45 Pm',
    status: 'Approved',
  },
];

// Simple monthly stats for Statistics tab (demo data)
const SIMPLE_MONTHLY_STATS = [
  { label: 'Jan 2025', value: 1 },
  { label: 'Feb 2025', value: 1 },
  { label: 'Mar 2025', value: 18 },
  { label: 'Apr 2025', value: 35 },
  { label: 'May 2025', value: 47 },
  { label: 'Jun 2025', value: 25 },
  { label: 'Jul 2025', value: 20 },
  { label: 'Aug 2025', value: 10 },
  { label: 'Sep 2025', value: 17 },
  { label: 'Oct 2025', value: 12 },
  { label: 'Nov 2025', value: 2 },
  { label: 'Dec 2025', value: 21 },
  { label: 'Jan 2026', value: 24 },
  { label: 'Feb 2026', value: 27 },
];

const MOCK_HRS = [
  {
    id: 1,
    name: 'Anita',
    email: 'Anita.Singh@3pillarglobal.com',
    mobile: '-',
    company: '3pillarglobal',
    technology: 'Python',
    jobType: 'WFH (Permanent)',
    addedBy: 'Xyz',
  },
  {
    id: 2,
    name: 'Sayali Bhongale',
    email: 'Sayali.Bhongale@Mphatek.com',
    mobile: '9175111799',
    company: 'MPhatek',
    technology: 'Automation Testing',
    jobType: 'Hybrid',
    addedBy: 'Kedar Wale',
  },
  {
    id: 3,
    name: 'Chetan Holayappa',
    email: 'Chetan.Ah@Resilinc.Ai',
    mobile: '-',
    company: 'Resilinc',
    technology: 'React Developer',
    jobType: 'WFH (Permanent)',
    addedBy: 'Pragati Khole',
  },
  {
    id: 4,
    name: 'Afrin Shaikh',
    email: 'Safrin@Teksystems.com',
    mobile: '9603716897',
    company: 'HSBC',
    technology: 'Manual Testing',
    jobType: 'Hybrid',
    addedBy: 'XYZ',
  },
  {
    id: 5,
    name: 'Satya Jagjpineilly',
    email: 'Satya@Shurutec.com',
    mobile: '9390714478',
    company: 'Shuru Technologies',
    technology: 'Python',
    jobType: 'WFH (Permanent)',
    addedBy: 'Pragati Bhole',
  },
];

function AdminCandidatesTable({
  candidates,
  filter,
  search,
  onBackToHome,
  onOpenAddForm,
  onChangeFilter,
  onChangeSearch,
  onToggleStatus,
  onDeleteCandidate,
  onViewCandidate,
  onEditCandidate,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
      {/* Header row - back + title + top-right buttons */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Left: back only */}
        <div className="flex items-start">
          <button
            onClick={onBackToHome}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-400 text-white shadow-sm hover:bg-slate-500"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Center: title */}
        <div className="flex-1 text-center">
          <span className="text-xs sm:text-sm font-semibold text-purple-600">
            Candidate List
          </span>
        </div>

        {/* Right: refresh + Add Candidate (top-right) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh icon */}
          <button
            type="button"
            onClick={() => {
              onChangeFilter('all');
              onChangeSearch('');
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          </button>

          {/* Add Candidate */}
          <button
            onClick={onOpenAddForm}
            className="inline-flex items-center gap-1.5 rounded-full bg-lime-500 px-3 sm:px-4 py-1.5 text-[11px] sm:text-sm font-semibold text-white shadow hover:bg-lime-600 whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Filters row under Add Candidate */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Left: total candidates (stacked like screenshot) */}
        <div className="flex flex-col items-center leading-snug">
          <span className="text-base font-semibold text-slate-800">
            {candidates.length}
          </span>
          <span className="text-[11px] text-slate-500">
            Total Candidates
          </span>
        </div>

        {/* Right: all filters grouped and right-aligned */}
        <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
          {/* Selected / Unselected pill */}
          <div className="flex rounded-full border border-purple-400 overflow-hidden text-[11px] sm:text-xs">
            <button
              onClick={() => onChangeFilter('selected')}
              className={`px-3 py-1 font-semibold ${
                filter === 'selected'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600'
              }`}
            >
              Selected
            </button>
            <button
              onClick={() => onChangeFilter('unselected')}
              className={`px-3 py-1 font-semibold ${
                filter === 'unselected'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600'
              }`}
            >
              Unselected
            </button>
          </div>

          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) => onChangeFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] sm:text-xs text-slate-700"
          >
            <option value="all">All</option>
            <option value="anil_sir">Anil sir</option>
            <option value="viraj_sir">Viraj sir</option>
            <option value="nilesh_sir">Nilesh sir</option>
            <option value="vishal_sir">Vishal sir</option>
          </select>

          {/* Search */}
          <div className="relative w-36 sm:w-48">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white pl-7 pr-3 py-1.5 text-[11px] sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200 w-10">
                Sr. No
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Name
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Mobile
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Experience
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Technologies
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Total Scheduled
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Last Interview
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Payment
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Regime Type
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Status
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 text-slate-700">{c.id}</td>
                <td className="px-3 py-2 text-slate-800">{c.name}</td>
                <td className="px-3 py-2 text-slate-700">{c.mobile}</td>
                <td className="px-3 py-2 text-slate-700">{c.experience}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {c.technologies.map((t) => (
                      <span
                        key={t}
                        className="inline-flex rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 text-slate-700">{c.totalScheduled}</td>
                <td className="px-3 py-2 text-slate-700">{c.lastInterview}</td>
                <td className="px-3 py-2 text-slate-700">{c.payment}</td>
                <td className="px-3 py-2 text-slate-700">{c.regime}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => onToggleStatus(c.id)}
                    className={`inline-flex rounded-full px-3 py-0.5 text-[11px] font-semibold ${
                      c.status === 'Active'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-300 text-slate-800'
                    }`}
                  >
                    {c.status}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onViewCandidate(c.id)}
                      className="h-7 w-7 rounded bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600 flex items-center justify-center"
                    >
                      <i className="fa-solid fa-eye" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => onEditCandidate(c.id)}
                      className="h-7 w-7 rounded bg-amber-400 text-white text-xs font-semibold hover:bg-amber-500 flex items-center justify-center"
                    >
                      <i className="fa-solid fa-pen" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => onDeleteCandidate(c.id)}
                      className="h-7 w-7 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-600 flex items-center justify-center"
                    >
                      <i className="fa-solid fa-trash" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminAddCandidateForm({ onBack, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    experience: '',
    password: '9256',
    technology: [],
    payment: '',
    referredBy: '',
  });
  const [showPassword, setShowPassword] = useState(true);
  const [showTechDropdown, setShowTechDropdown] = useState(false);

  const techOptions = [
    'PHP',
    '.net Developer',
    'Data Science',
    'MERN Stack',
    'MEAN Stack',
    'Java',
    'App Support',
    'Business Analyst',
    'Automation Testing',
    'Dev Ops(Awg)',
    'Dev Ops(Azure)',
    'Data Analysts',
    'AEM',
    'Power BI',
    'Node.js Developer',
    'Other',
  ];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleTechOption = (value) => {
    setForm((prev) => {
      const exists = prev.technology.includes(value);
      return {
        ...prev,
        technology: exists
          ? prev.technology.filter((v) => v !== value)
          : [...prev.technology, value],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6"
    >
      {/* Header: back button left, title centered like other pages */}
      <div className="flex items-center justify-between mb-4 gap-3">
        {/* Left: back button */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeftIcon className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Center: title */}
        <div className="flex-1 text-center">
          <h2 className="text-sm sm:text-base font-semibold text-purple-600">
            Add New Candidate
          </h2>
        </div>

        {/* Right: spacer to balance layout */}
        <div className="w-10 sm:w-16" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {/* Candidate Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            * Candidate Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Enter candidate name"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            * Mobile
          </label>
          <input
            type="tel"
            value={form.mobile}
            onChange={handleChange('mobile')}
            placeholder="Enter mobile number"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            Experience
          </label>
          <input
            type="text"
            value={form.experience}
            onChange={handleChange('experience')}
            placeholder="Enter experience (e.g., 2 yrs)"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Password with Font Awesome show/hide icon */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            * Password
          </label>
          <div className="flex items-stretch">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              className="flex-1 rounded-l-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="inline-flex items-center justify-center rounded-r-md border border-l-0 border-slate-200 bg-slate-50 px-3 text-slate-500 hover:bg-slate-100"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i
                className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Technology (custom multi-select dropdown, tags inside input like screenshot) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            * Technology
          </label>
          <div className="relative">
            {/* Visible input box with tags */}
            <div
              className="w-full flex items-center justify-between rounded-md border border-slate-200 bg-white px-2 py-1 text-xs sm:text-sm text-slate-800 cursor-pointer focus-within:ring-2 focus-within:ring-purple-200"
              onClick={() => setShowTechDropdown((v) => !v)}
            >
              <div className="flex flex-wrap gap-1 flex-1 min-h-[30px] items-center">
                {form.technology.length ? (
                  form.technology.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTechOption(tech);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-slate-200 px-2 py-0.5 text-[11px] text-slate-800"
                    >
                      <span>{tech}</span>
                      <span className="text-slate-500 text-[10px]">×</span>
                    </button>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs sm:text-sm">
                    Choose Technologies...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pl-2">
                {form.technology.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm((prev) => ({ ...prev, technology: [] }));
                    }}
                    className="text-slate-400 text-xs hover:text-slate-600"
                    aria-label="Clear technologies"
                  >
                    ×
                  </button>
                )}
                <i className="fa-solid fa-chevron-down text-slate-400 text-xs" />
              </div>
            </div>
            {showTechDropdown && (
              <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg max-h-52 overflow-auto">
                {techOptions.map((opt) => {
                  const selected = form.technology.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        toggleTechOption(opt);
                        setShowTechDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm border-b border-slate-100 ${
                        selected
                          ? 'bg-sky-100 text-slate-900'
                          : 'bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            Payment
          </label>
          <input
            type="text"
            value={form.payment}
            onChange={handleChange('payment')}
            placeholder="Enter payment amount"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-s
          "
          />
        </div>

        {/* Referred By (single-select) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            * Referred By
          </label>
          <select
            value={form.referredBy}
            onChange={handleChange('referredBy')}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="">Select Referred By</option>
            <option value="Anil Shinde Sir">Anil Shinde Sir</option>
            <option value="Viraj Kadam Sir">Viraj Kadam Sir</option>
            <option value="Nilesh Sir">Nilesh Sir</option>
            <option value="Vishal Sir">Vishal Sir</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-purple-500 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-purple-600"
        >
          Add Candidate
        </button>
      </div>
    </form>
  );
}

const EDIT_TECH_OPTIONS = [
  'PHP',
  'Python',
  'Business Analyst',
  '.net Developer',
  'Data Science',
  'MERN Stack',
  'MEAN Stack',
  'Java',
  'React Developer',
  'App Support',
  'Automation Testing',
  'Dev Ops(Awg)',
  'Dev Ops(Azure)',
  'Data Analysts',
  'AEM',
  'Power BI',
  'Node.js Developer',
  'Other',
];

function AdminEditCandidateForm({ candidate, onBack, onSubmit }) {
  const [form, setForm] = useState({
    name: candidate?.name || '',
    mobile: candidate?.mobile || '',
    experience: candidate?.experience || '',
    password: candidate?.password || candidate?.mobile?.slice(-4) || '',
    technology: Array.isArray(candidate?.technologies) ? [...candidate.technologies] : [],
    payment: candidate?.payment?.replace(/[₹,]|\s/g, '') || '0',
    referredBy: candidate?.referredBy || 'Viraj Kadam Sir',
    selected: candidate?.selected ?? false,
    selectedDate: candidate?.selectedDate || '',
    joiningDate: candidate?.joiningDate || '',
    selectedCompany: candidate?.selectedCompany || '',
    package: candidate?.package || '',
  });
  const [showPassword, setShowPassword] = useState(true);
  const [showTechDropdown, setShowTechDropdown] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleTechOption = (value) => {
    setForm((prev) => {
      const exists = prev.technology.includes(value);
      return {
        ...prev,
        technology: exists
          ? prev.technology.filter((v) => v !== value)
          : [...prev.technology, value],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const techOptions = [...new Set([...form.technology, ...EDIT_TECH_OPTIONS])];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6"
    >
      {/* Header: grey back button left, title centered */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-400 text-white shadow-sm hover:bg-slate-500"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center">
          <h2 className="text-sm sm:text-base font-semibold text-purple-600">
            Edit Candidate
          </h2>
        </div>

        <div className="w-10 sm:w-16" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {/* Candidate Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            <span className="text-red-500">*</span> Candidate Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Enter candidate name"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            <span className="text-red-500">*</span> Mobile
          </label>
          <input
            type="tel"
            value={form.mobile}
            onChange={handleChange('mobile')}
            placeholder="Enter mobile number"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            Experience
          </label>
          <input
            type="text"
            value={form.experience}
            onChange={handleChange('experience')}
            placeholder="Enter experience (e.g., 2 yrs)"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Password with show/hide toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            <span className="text-red-500">*</span> Password
          </label>
          <div className="flex items-stretch">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              className="flex-1 rounded-l-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200 rounded-r-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="inline-flex items-center justify-center rounded-r-md border border-l-0 border-slate-200 bg-slate-50 px-3 text-slate-500 hover:bg-slate-100"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i
                className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Technology (multi-select with tags) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            <span className="text-red-500">*</span> Technology
          </label>
          <div className="relative">
            <div
              className="w-full flex items-center justify-between rounded-md border border-slate-200 bg-white px-2 py-1 text-xs sm:text-sm text-slate-800 cursor-pointer focus-within:ring-2 focus-within:ring-purple-200"
              onClick={() => setShowTechDropdown((v) => !v)}
            >
              <div className="flex flex-wrap gap-1 flex-1 min-h-[30px] items-center">
                {form.technology.length ? (
                  form.technology.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTechOption(tech);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-slate-200 px-2 py-0.5 text-[11px] text-slate-800"
                    >
                      <span>{tech}</span>
                      <span className="text-slate-500 text-[10px]">×</span>
                    </button>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs sm:text-sm">
                    Choose Technologies...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pl-2">
                {form.technology.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm((prev) => ({ ...prev, technology: [] }));
                    }}
                    className="text-slate-400 text-xs hover:text-slate-600"
                    aria-label="Clear technologies"
                  >
                    ×
                  </button>
                )}
                <i className="fa-solid fa-chevron-down text-slate-400 text-xs" />
              </div>
            </div>
            {showTechDropdown && (
              <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg max-h-52 overflow-auto">
                {techOptions.map((opt) => {
                  const selected = form.technology.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        toggleTechOption(opt);
                        setShowTechDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm border-b border-slate-100 last:border-b-0 ${
                        selected
                          ? 'bg-sky-100 text-slate-900'
                          : 'bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            Payment
          </label>
          <input
            type="text"
            value={form.payment}
            onChange={handleChange('payment')}
            placeholder="Enter payment amount"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Selected toggle - always visible */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            Selected
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={form.selected}
              onClick={() => setForm((prev) => ({ ...prev, selected: !prev.selected }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-offset-2 ${
                form.selected ? 'bg-purple-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                  form.selected ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-[11px] text-slate-600">
              {form.selected ? 'Selected' : 'Not Selected'}
            </span>
          </div>
        </div>

        {/* Normal form: Referred By dropdown - only when NOT selected */}
        {!form.selected && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              <span className="text-red-500">*</span> Referred By
            </label>
            <select
              value={form.referredBy}
              onChange={handleChange('referredBy')}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="">Select Referred By</option>
              <option value="Anil Shinde Sir">Anil Shinde Sir</option>
              <option value="Viraj Kadam Sir">Viraj Kadam Sir</option>
              <option value="Nilesh Sir">Nilesh Sir</option>
              <option value="Vishal Sir">Vishal Sir</option>
            </select>
          </div>
        )}
      </div>

      {/* Selected form: extra fields - only when Selected is ON */}
      {form.selected && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start mt-4 pt-4 border-t border-slate-200">
          {/* Selected Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              <span className="text-red-500">*</span> Selected Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.selectedDate}
                onChange={handleChange('selectedDate')}
                placeholder="mm/dd/yyyy"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <i className="fa-solid fa-calendar absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* Joining Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              <span className="text-red-500">*</span> Joining Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.joiningDate}
                onChange={handleChange('joiningDate')}
                placeholder="mm/dd/yyyy"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <i className="fa-solid fa-calendar absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* Selected Company */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              Selected Company
            </label>
            <input
              type="text"
              value={form.selectedCompany}
              onChange={handleChange('selectedCompany')}
              placeholder="Enter company name"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Package */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              <span className="text-red-500">*</span> Package
            </label>
            <input
              type="text"
              value={form.package}
              onChange={handleChange('package')}
              placeholder="Enter package amount"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Referred By - in selected view */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              <span className="text-red-500">*</span> Referred By
            </label>
            <select
              value={form.referredBy}
              onChange={handleChange('referredBy')}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="">Select Referred By</option>
              <option value="Anil Shinde Sir">Anil Shinde Sir</option>
              <option value="Viraj Kadam Sir">Viraj Kadam Sir</option>
              <option value="Nilesh Sir">Nilesh Sir</option>
              <option value="Vishal Sir">Vishal Sir</option>
            </select>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-purple-500 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-purple-600"
        >
          Update Candidate
        </button>
      </div>
    </form>
  );
}

function AdminSlotsTable({
  slots,
  filter,
  search,
  onChangeFilter,
  onChangeSearch,
  onBackToHome,
  onApproveSlot,
  onRejectSlot,
  onOpenCandidateSlots,
}) {
  const totalSlots = slots.length;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
      {/* Header row with back + title */}
      <div className="flex items-center justify-between mb-2 gap-3">
        {/* Left: back button only */}
        <div className="flex items-center">
          <button
            onClick={onBackToHome}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-400 text-white shadow-sm hover:bg-slate-500"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Center: title */}
        <div className="flex-1 text-center">
          <span className="text-xs sm:text-sm font-semibold text-purple-600">
            Slots
          </span>
        </div>

        {/* Right: empty spacer */}
        <div className="w-32 sm:w-40" />
      </div>

      {/* Metrics + Filters (same alignment row like screenshot) */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: metrics - stacked number + label like screenshot */}
        <div className="flex flex-wrap gap-6 text-xs sm:text-sm text-slate-700">
          <div className="flex flex-col items-center">
            <span className="text-sm sm:text-base font-semibold text-slate-800">
              {totalSlots}
            </span>
            <span className="text-[11px] text-slate-500">Total Slots</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm sm:text-base font-semibold text-slate-800">
              17
            </span>
            <span className="text-[11px] text-slate-500">Last Week</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm sm:text-base font-semibold text-slate-800">
              14
            </span>
            <span className="text-[11px] text-slate-500">This Week</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm sm:text-base font-semibold text-slate-800">
              16.5
            </span>
            <span className="text-[11px] text-slate-500">Avg/Week</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm sm:text-base font-semibold text-slate-800">
              2.4
            </span>
            <span className="text-[11px] text-slate-500">Avg/Day</span>
          </div>
        </div>

        {/* Right: filters */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              onChangeFilter('all');
              onChangeSearch('');
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          </button>

          <select
            value={filter}
            onChange={(e) => onChangeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs sm:text-sm text-slate-700"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="relative w-32 sm:w-40">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search slot"
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white pl-7 pr-3 py-1.5 text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>
      </div>

      {/* Slots table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200 w-10">
                Sr No.
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Name
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Company
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Technology
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Round
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Created At
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Date
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Time
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Status
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, index) => {
              const isPending = slot.status === 'Pending';
              const isApproved = slot.status === 'Approved';
              const isRejected = slot.status === 'Rejected';

              const statusIconClass = isApproved
                ? 'fa-circle-check text-emerald-500'
                : isRejected
                ? 'fa-circle-xmark text-red-500'
                : 'fa-clock text-amber-500';

              const statusTextClass = isApproved
                ? 'text-emerald-600'
                : isRejected
                ? 'text-red-600'
                : 'text-slate-800';
              return (
                <tr
                  key={slot.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-2 text-slate-700">{index + 1}</td>
                  <td
                    className="px-3 py-2 text-purple-600 font-semibold cursor-pointer"
                    onClick={() =>
                      onOpenCandidateSlots && onOpenCandidateSlots(slot.name)
                    }
                  >
                    {slot.name}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{slot.company}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {slot.technology}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{slot.round}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {slot.createdAt}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {slot.dateLabel}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {slot.timeLabel}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <div className="inline-flex items-center gap-2">
                        <i
                          className={`fa-solid ${statusIconClass}`}
                          aria-hidden="true"
                        />
                        <span className={`font-semibold ${statusTextClass}`}>
                          {slot.status}
                        </span>
                      </div>
                      {isApproved && (
                        <span className="mt-0.5 text-[11px] text-emerald-600">
                          by Admin
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {isPending ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApproveSlot(slot.id)}
                          className="inline-flex items-center gap-2 rounded bg-emerald-500 px-4 py-2 text-[11px] font-semibold text-white hover:bg-emerald-600"
                        >
                          <i className="fa-solid fa-check" aria-hidden="true" />
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectSlot(slot.id)}
                          className="inline-flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-[11px] font-semibold text-white hover:bg-red-600"
                        >
                          <i className="fa-solid fa-xmark" aria-hidden="true" />
                          Reject
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 w-10 items-center justify-center rounded bg-red-500 text-white hover:bg-red-600"
                          onClick={() => onRejectSlot(slot.id)}
                          aria-label="Delete"
                        >
                          <i className="fa-solid fa-trash" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <button
                          type="button"
                          className="inline-flex h-9 w-10 items-center justify-center rounded bg-red-500 text-white hover:bg-red-600"
                          aria-label="Delete"
                        >
                          <i className="fa-solid fa-trash" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminHRsTable({
  hrs,
  totalCount,
  search,
  onBackToHome,
  onChangeSearch,
  onAddHR,
  onUpdateHR,
}) {
  const [companyFilter, setCompanyFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    company: '',
    technology: '',
    jobType: '',
  });
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);

  const companyOptions = useMemo(
    () =>
      Array.from(
        new Set(hrs.map((h) => h.company).filter((c) => c && c.trim())),
      ),
    [hrs],
  );
  const techOptions = useMemo(
    () =>
      Array.from(
        new Set(hrs.map((h) => h.technology).filter((t) => t && t.trim())),
      ),
    [hrs],
  );
  const jobTypeOptions = useMemo(
    () =>
      Array.from(
        new Set(hrs.map((h) => h.jobType).filter((j) => j && j.trim())),
      ),
    [hrs],
  );

  const filteredRows = useMemo(() => {
    return hrs.filter((hr) => {
      if (companyFilter && hr.company !== companyFilter) return false;
      if (techFilter && hr.technology !== techFilter) return false;
      if (jobTypeFilter && hr.jobType !== jobTypeFilter) return false;
      return true;
    });
  }, [hrs, companyFilter, techFilter, jobTypeFilter]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    if (modalMode === 'edit' && onUpdateHR && editingId != null) {
      onUpdateHR(editingId, form);
    } else if (onAddHR) {
      onAddHR(form);
    }
    setForm({
      name: '',
      email: '',
      mobile: '',
      company: '',
      technology: '',
      jobType: '',
    });
    setEditingId(null);
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
      {/* Header row - back + title + top-right buttons */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Left: back only */}
        <div className="flex items-start">
          <button
            onClick={onBackToHome}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-400 text-white shadow-sm hover:bg-slate-500"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Center: title */}
        <div className="flex-1 text-center">
          <span className="text-xs sm:text-sm font-semibold text-purple-600">
            Hrs List
          </span>
        </div>

        {/* Right: refresh + Add HR */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              setModalMode('add');
              setEditingId(null);
              setForm({
                name: '',
                email: '',
                mobile: '',
                company: '',
                technology: '',
                jobType: '',
              });
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-lime-500 px-3 sm:px-4 py-1.5 text-[11px] sm:text-sm font-semibold text-white shadow hover:bg-lime-600 whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add HR</span>
          </button>
        </div>
      </div>

      {/* Filters + total count row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Left: total HRs */}
        <div className="flex flex-col items-center leading-snug">
          <span className="text-base font-semibold text-slate-800">
            {totalCount}
          </span>
          <span className="text-[11px] text-slate-500">Total HRs</span>
        </div>

        {/* Right: filters row */}
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Company filter dropdown pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowCompanyDropdown((v) => !v);
                setShowTechDropdown(false);
                setShowJobTypeDropdown(false);
              }}
              className="flex items-center rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] sm:text-xs text-slate-700 min-w-[90px] justify-between"
            >
              <span className="truncate">
                {companyFilter || 'Company'}
              </span>
              <span className="flex items-center gap-1 ml-2">
                {companyFilter && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCompanyFilter('');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                    aria-label="Clear company filter"
                  >
                    ×
                  </button>
                )}
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400" />
              </span>
            </button>
            {showCompanyDropdown && (
              <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg max-h-52 overflow-auto text-[11px] sm:text-xs">
                {companyOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setCompanyFilter(opt);
                      setShowCompanyDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 ${
                      companyFilter === opt
                        ? 'bg-sky-100 text-slate-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Technology filter dropdown pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowTechDropdown((v) => !v);
                setShowCompanyDropdown(false);
                setShowJobTypeDropdown(false);
              }}
              className="flex items-center rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] sm:text-xs text-slate-700 min-w-[110px] justify-between"
            >
              <span className="truncate">
                {techFilter || 'Technology'}
              </span>
              <span className="flex items-center gap-1 ml-2">
                {techFilter && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTechFilter('');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                    aria-label="Clear technology filter"
                  >
                    ×
                  </button>
                )}
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400" />
              </span>
            </button>
            {showTechDropdown && (
              <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg max-h-52 overflow-auto text-[11px] sm:text-xs">
                {techOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setTechFilter(opt);
                      setShowTechDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 ${
                      techFilter === opt
                        ? 'bg-sky-100 text-slate-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Job Type filter dropdown pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowJobTypeDropdown((v) => !v);
                setShowCompanyDropdown(false);
                setShowTechDropdown(false);
              }}
              className="flex items-center rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] sm:text-xs text-slate-700 min-w-[100px] justify-between"
            >
              <span className="truncate">
                {jobTypeFilter || 'Job Type'}
              </span>
              <span className="flex items-center gap-1 ml-2">
                {jobTypeFilter && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setJobTypeFilter('');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                    aria-label="Clear job type filter"
                  >
                    ×
                  </button>
                )}
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400" />
              </span>
            </button>
            {showJobTypeDropdown && (
              <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg max-h-52 overflow-auto text-[11px] sm:text-xs">
                {jobTypeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setJobTypeFilter(opt);
                      setShowJobTypeDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 ${
                      jobTypeFilter === opt
                        ? 'bg-sky-100 text-slate-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search box */}
          <div className="relative w-40 sm:w-52">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search HRs"
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white pl-7 pr-3 py-1.5 text-[11px] sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>
      </div>

      {/* HRs table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200 w-12">
                Sr No.
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Name
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Email
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Mobile
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Company
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Technology
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Job Type
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Added By
              </th>
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((hr, index) => (
              <tr
                key={hr.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-3 py-2 text-slate-700">{index + 1}</td>
                <td className="px-3 py-2 text-slate-800">{hr.name}</td>
                <td className="px-3 py-2 text-slate-700">{hr.email}</td>
                <td className="px-3 py-2 text-slate-700">{hr.mobile}</td>
                <td className="px-3 py-2 text-slate-700">{hr.company}</td>
                <td className="px-3 py-2 text-slate-700">{hr.technology}</td>
                <td className="px-3 py-2 text-slate-700">{hr.jobType}</td>
                <td className="px-3 py-2 text-slate-700">{hr.addedBy}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setModalMode('edit');
                        setEditingId(hr.id);
                        setForm({
                          name: hr.name || '',
                          email: hr.email || '',
                          mobile: hr.mobile || '',
                          company: hr.company || '',
                          technology: hr.technology || '',
                          jobType: hr.jobType || '',
                        });
                        setShowAddModal(true);
                      }}
                      className="h-7 w-7 rounded bg-amber-400 text-white text-xs font-semibold hover:bg-amber-500 flex items-center justify-center"
                      aria-label="Edit HR"
                    >
                      <i className="fa-solid fa-pen" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="h-7 w-7 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-600 flex items-center justify-center"
                      aria-label="Delete HR"
                    >
                      <i className="fa-solid fa-trash" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add HR modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg rounded-xl bg-white shadow-lg px-6 py-5"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800">
                {modalMode === 'edit' ? 'Edit HR' : 'Add HR'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Fields grid - arranged like reference screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1: HR Name | Technology */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  * HR Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter HR Name"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  * Technology
                </label>
                <select
                  value={form.technology}
                  onChange={handleChange('technology')}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  <option value="">Select Technology</option>
                  {techOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 2: Email | Mobile */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  * Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter Email"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Mobile
                </label>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange('mobile')}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter 10 digit mobile number"
                />
              </div>

              {/* Row 3: Job Type (full width on md) */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Job Type
                </label>
                <select
                  value={form.jobType}
                  onChange={handleChange('jobType')}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  <option value="">Select Job Type</option>
                  {jobTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: Company Name full width */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Company Name
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={handleChange('company')}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter Company Name"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-between">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50"
              >
                <i className="fa-solid fa-xmark text-xs" aria-hidden="true" />
                Close
              </button>
              <button
                type="submit"
                className={`inline-flex items-center gap-2 rounded-md px-5 py-1.5 text-xs sm:text-sm font-semibold text-white ${
                  modalMode === 'edit'
                    ? 'bg-amber-400 hover:bg-amber-500'
                    : 'bg-lime-500 hover:bg-lime-600'
                }`}
              >
                <i
                  className={`fa-solid ${
                    modalMode === 'edit' ? 'fa-pen' : 'fa-plus'
                  } text-xs`}
                  aria-hidden="true"
                />
                {modalMode === 'edit' ? 'Update HR' : 'Add New HR'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Detailed view: all slots booked by a specific candidate (from Slots tab)
function AdminCandidateSlotsView({ data, onBack }) {
  const { name, candidate, slots } = data;

  const regime = candidate?.regime || 'new-70';
  const payment = candidate?.payment || '₹0';
  const experience =
    candidate?.experience && candidate.experience !== '-'
      ? candidate.experience
      : 'Not specified';
  const referredBy = candidate?.referredBy || 'Viraj Kadam Sir';
  const totalCount = slots.length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
      {/* Header row: back, title center, referred by right */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-400 text-white shadow-sm hover:bg-slate-500"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center">
          <span className="text-xs sm:text-sm font-semibold text-purple-600">
            Slot Book By {name}
          </span>
        </div>

        <div className="text-[11px] sm:text-xs text-slate-600 whitespace-nowrap">
          Referred By:{' '}
          <span className="font-semibold text-slate-800">{referredBy}</span>
        </div>
      </div>

      {/* Candidate summary bar */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 text-center text-[11px] sm:text-xs text-slate-600">
        <div className="flex flex-col items-center">
          <span className="text-sm sm:text-base font-semibold text-slate-800">
            {regime}
          </span>
          <span>Regime Type</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm sm:text-base font-semibold text-slate-800">
            {payment}
          </span>
          <span>Payment</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm sm:text-base font-semibold text-slate-800">
            {experience}
          </span>
          <span>Experience</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm sm:text-base font-semibold text-slate-800">
            {totalCount}
          </span>
          <span>Total Interview Count</span>
        </div>
      </div>

      {/* Slots cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {slots.map((slot) => {
          const isApproved = slot.status === 'Approved';
          const isRejected = slot.status === 'Rejected';

          return (
            <div
              key={slot.id}
              className="rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-3 text-xs sm:text-sm text-slate-700 flex flex-col gap-1.5"
            >
              <div className="font-semibold text-slate-900">
                {slot.company}
              </div>
              <div className="text-[11px] text-slate-500">Company</div>

              <div className="mt-1">
                <div className="text-slate-800">{slot.technology}</div>
                <div className="text-[11px] text-slate-500">Technology</div>
              </div>

              <div className="mt-1">
                <div className="text-slate-800">{slot.round}</div>
                <div className="text-[11px] text-slate-500">Round</div>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-600 font-semibold">
                  {isApproved
                    ? 'Approved'
                    : isRejected
                    ? 'Rejected'
                    : 'Pending'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 -mt-1">Status</div>

              <div className="mt-1">
                <div className="text-slate-800">{slot.dateLabel}</div>
                <div className="text-[11px] text-slate-500">Date</div>
              </div>

              <div className="mt-1">
                <div className="text-slate-800">{slot.timeLabel}</div>
                <div className="text-[11px] text-slate-500">Time</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminLeavesTable({ onBackToHome }) {
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaves, setLeaves] = useState([]);
  const leaveDateInputRef = useRef(null);

  const formatLeaveDate = (isoDate) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSaveLeave = () => {
    if (!leaveDate) return;
    setLeaves((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: formatLeaveDate(leaveDate),
      },
    ]);
    setLeaveDate('');
    setShowAddLeave(false);
  };

  const handleDeleteLeave = (id) => {
    setLeaves((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4 gap-3">
        {/* Left: back */}
        <div className="flex items-center">
          <button
            onClick={onBackToHome}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-400 text-white shadow-sm hover:bg-slate-500"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Center: title */}
        <div className="flex-1 text-center">
          <span className="text-xs sm:text-sm font-semibold text-purple-600">
            Admin Leaves
          </span>
        </div>

        {/* Right: refresh + add leave */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            aria-label="Refresh"
            onClick={() => {
              // simple refresh: no-op for now
            }}
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setShowAddLeave(true)}
            className="inline-flex items-center gap-2 rounded-md bg-lime-500 px-3 sm:px-4 py-2 text-[11px] sm:text-sm font-semibold text-white shadow hover:bg-lime-600 whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            Add Leave
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-indigo-50 text-slate-700">
              <th className="px-4 py-2 text-left font-semibold border-b border-slate-200">
                Date{' '}
                <span className="text-purple-500 text-xs align-middle">⇵</span>
              </th>
              <th className="px-4 py-2 text-right font-semibold border-b border-slate-200 w-28">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={2}>
                  No leaves found
                </td>
              </tr>
            ) : (
              leaves.map((leave, index) => (
                <tr
                  key={leave.id}
                  className={`border-b border-slate-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  }`}
                >
                  <td className="px-4 py-3 text-slate-700">
                    {leave.date}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteLeave(leave.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-500 text-white text-xs hover:bg-red-600"
                      aria-label="Delete leave"
                    >
                      <i className="fa-solid fa-trash" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer pagination */}
      <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-500">
        <button
          className="px-2 py-1 rounded hover:bg-slate-50"
          aria-label="First page"
        >
          &laquo;
        </button>
        <button
          className="px-2 py-1 rounded hover:bg-slate-50"
          aria-label="Previous page"
        >
          &lsaquo;
        </button>
        <button
          className="px-2 py-1 rounded hover:bg-slate-50"
          aria-label="Next page"
        >
          &rsaquo;
        </button>
        <button
          className="px-2 py-1 rounded hover:bg-slate-50"
          aria-label="Last page"
        >
          &raquo;
        </button>

        <select className="ml-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
      </div>

      {/* Add Leave modal */}
      {showAddLeave && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="relative w-full max-w-sm rounded-xl bg-white shadow-lg px-5 py-4">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">
                Add Leave
              </h3>
              <button
                type="button"
                onClick={() => setShowAddLeave(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Date field with Font Awesome calendar icon */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  ref={leaveDateInputRef}
                  className="w-full rounded-md border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="mm/dd/yyyy"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => {
                    if (leaveDateInputRef.current) {
                      if (typeof leaveDateInputRef.current.showPicker === 'function') {
                        leaveDateInputRef.current.showPicker();
                      } else {
                        leaveDateInputRef.current.focus();
                      }
                    }
                  }}
                  aria-label="Open calendar"
                >
                  <i className="fa-regular fa-calendar-days text-sm" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={() => setShowAddLeave(false)}
                className="rounded-md border border-slate-200 px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveLeave}
                className="rounded-md bg-lime-500 px-5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-lime-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Very simple bar graph for Statistics tab using demo data
function AdminStatisticsChart() {
  const stats = SIMPLE_MONTHLY_STATS;

  const maxValue = stats.reduce(
    (max, item) => (item.value > max ? item.value : max),
    0,
  );

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
      <h2 className="text-sm sm:text-base font-semibold text-slate-800">
        Monthly Slot Statistics
      </h2>
      <p className="mt-1 text-[11px] sm:text-xs text-slate-500">
        Showing statistics from Jan 2025 to Feb 2026
      </p>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="relative h-64 rounded-xl border border-slate-100 bg-white overflow-hidden">
            {/* Soft horizontal bands behind bars */}
            <div className="absolute inset-0 flex flex-col">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={idx % 2 === 0 ? 'flex-1 bg-slate-50' : 'flex-1 bg-white'}
                />
              ))}
            </div>

            {/* Bars */}
            <div className="relative z-10 flex h-full items-end px-6 pb-8 gap-4">
              {stats.map((item) => {
                // Use fixed pixel heights so bars are always visible
                const barHeight = item.value * 4; // 0–50 -> 0–200px
                return (
                  <div
                    key={item.label}
                    className="flex-1 min-w-[40px] flex flex-col items-center justify-end"
                  >
                    <div
                      className="w-6 rounded-t-md bg-indigo-400"
                      style={{ height: `${barHeight}px` }}
                    />
                    <div className="mt-2 text-[10px] text-slate-500 text-center whitespace-nowrap">
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddForm, setShowAddForm] = useState(false);
  const [candidateFilter, setCandidateFilter] = useState('all');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [slotFilter, setSlotFilter] = useState('all');
  const [slotSearch, setSlotSearch] = useState('');
  const [slots, setSlots] = useState(MOCK_SLOTS);
  const [selectedSlotsCandidate, setSelectedSlotsCandidate] = useState(null);
  const [selectedViewCandidate, setSelectedViewCandidate] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [hrs, setHrs] = useState(MOCK_HRS);
  const [hrSearch, setHrSearch] = useState('');
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today));

  const weekEnd = useMemo(() => {
    const days = getWeekDays(weekStart, 6);
    return days[days.length - 1];
  }, [weekStart]);

  const rangeLabel = useMemo(
    () => formatWeekRangeLabel(weekStart, weekEnd),
    [weekStart, weekEnd],
  );

  const todaysSlotsCount = useMemo(() => {
    return ADMIN_EVENTS.filter((event) => {
      const eventDate = parseISOToDate(event.start);
      return isSameDay(eventDate, today);
    }).length;
  }, [today]);

  const weekSlotsCount = useMemo(() => {
    return ADMIN_EVENTS.filter((event) => {
      const d = parseISOToDate(event.start);
      return d >= weekStart && d <= weekEnd;
    }).length;
  }, [weekStart, weekEnd]);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (slotFilter === 'pending' && slot.status !== 'Pending') return false;
      if (slotFilter === 'approved' && slot.status !== 'Approved') return false;
      if (slotFilter === 'rejected' && slot.status !== 'Rejected') return false;
      if (slotSearch.trim()) {
        const q = slotSearch.toLowerCase();
        if (
          !slot.name.toLowerCase().includes(q) &&
          !slot.company.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [slots, slotFilter, slotSearch]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      if (candidateFilter === 'selected' && !c.selected) return false;
      if (candidateFilter === 'unselected' && c.selected) return false;
      if (candidateFilter === 'anil_sir') {
        const ref = (c.referredBy || '').toLowerCase();
        if (!ref.includes('anil')) return false;
      }
      if (candidateFilter === 'viraj_sir') {
        const ref = (c.referredBy || '').toLowerCase();
        if (!ref.includes('viraj')) return false;
      }
      if (candidateFilter === 'nilesh_sir') {
        const ref = (c.referredBy || '').toLowerCase();
        if (!ref.includes('nilesh')) return false;
      }
      if (candidateFilter === 'vishal_sir') {
        const ref = (c.referredBy || '').toLowerCase();
        if (!ref.includes('vishal')) return false;
      }
      if (candidateSearch.trim()) {
        const q = candidateSearch.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.mobile.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [candidates, candidateFilter, candidateSearch]);

  const filteredHRs = useMemo(() => {
    return hrs.filter((hr) => {
      if (!hrSearch.trim()) return true;
      const q = hrSearch.toLowerCase();
      return (
        hr.name.toLowerCase().includes(q) ||
        hr.email.toLowerCase().includes(q) ||
        (hr.mobile && hr.mobile.toLowerCase().includes(q))
      );
    });
  }, [hrs, hrSearch]);

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const handleToday = () => {
    setWeekStart(getWeekStart(new Date()));
  };

  const handleToggleStatus = (id) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' }
          : c,
      ),
    );
  };

  const handleDeleteCandidate = (id) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleViewCandidate = (id) => {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      const candidateSlots = slots.filter((s) => s.name === candidate.name);
      setSelectedViewCandidate({
        name: candidate.name,
        candidate,
        slots: candidateSlots,
      });
    }
  };

  const handleEditCandidate = (id) => {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      setEditingCandidate(candidate);
    }
  };

  const handleApproveSlot = (id) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === id ? { ...slot, status: 'Approved' } : slot,
      ),
    );
  };

  const handleRejectSlot = (id) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === id ? { ...slot, status: 'Rejected' } : slot,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <AdminTopNav activeTab={activeTab} onChange={setActiveTab} />
      <main className="p-2 sm:p-4 md:p-8">
        {activeTab === 'candidates' ? (
          showAddForm ? (
            <AdminAddCandidateForm
              onBack={() => setShowAddForm(false)}
              onSubmit={(data) => {
                const nextId = candidates.length
                  ? Math.max(...candidates.map((c) => c.id)) + 1
                  : 1;
                const newCandidate = {
                  id: nextId,
                  name: data.name || `New Candidate ${nextId}`,
                  mobile: data.mobile || '0000000000',
                  experience: data.experience || '0',
                  technologies: Array.isArray(data.technology)
                    ? data.technology
                    : data.technology
                    ? [data.technology]
                    : [],
                  totalScheduled: '0',
                  lastInterview: '-',
                  payment: data.payment || '₹0',
                  regime: '-',
                  status: 'Active',
                  selected: false,
                };
                setCandidates((prev) => [...prev, newCandidate]);
                setShowAddForm(false);
              }}
            />
          ) : editingCandidate ? (
            <AdminEditCandidateForm
              candidate={editingCandidate}
              onBack={() => setEditingCandidate(null)}
              onSubmit={(data) => {
                const paymentVal = data.payment?.replace(/[₹,]|\s/g, '') || '0';
                setCandidates((prev) =>
                  prev.map((c) =>
                    c.id === editingCandidate.id
                      ? {
                          ...c,
                          name: data.name || c.name,
                          mobile: data.mobile || c.mobile,
                          experience: data.experience || c.experience || '-',
                          technologies: Array.isArray(data.technology)
                            ? data.technology
                            : data.technology
                            ? [data.technology]
                            : c.technologies,
                          payment: paymentVal ? `₹${paymentVal}` : '₹0',
                          referredBy: data.referredBy || c.referredBy,
                          selected: data.selected ?? c.selected,
                          password: data.password,
                          ...(data.selected && {
                            selectedDate: data.selectedDate,
                            joiningDate: data.joiningDate,
                            selectedCompany: data.selectedCompany,
                            package: data.package,
                          }),
                        }
                      : c,
                  ),
                );
                setEditingCandidate(null);
              }}
            />
          ) : selectedViewCandidate ? (
            <AdminCandidateSlotsView
              data={selectedViewCandidate}
              onBack={() => setSelectedViewCandidate(null)}
            />
          ) : (
            <AdminCandidatesTable
              candidates={filteredCandidates}
              filter={candidateFilter}
              search={candidateSearch}
              onBackToHome={() => setActiveTab('home')}
              onOpenAddForm={() => setShowAddForm(true)}
              onChangeFilter={setCandidateFilter}
              onChangeSearch={setCandidateSearch}
              onToggleStatus={handleToggleStatus}
              onDeleteCandidate={handleDeleteCandidate}
              onViewCandidate={handleViewCandidate}
              onEditCandidate={handleEditCandidate}
            />
          )
        ) : activeTab === 'slots' ? (
          selectedSlotsCandidate ? (
            <AdminCandidateSlotsView
              data={selectedSlotsCandidate}
              onBack={() => setSelectedSlotsCandidate(null)}
            />
          ) : (
            <AdminSlotsTable
              slots={filteredSlots}
              filter={slotFilter}
              search={slotSearch}
              onChangeFilter={setSlotFilter}
              onChangeSearch={setSlotSearch}
              onBackToHome={() => setActiveTab('home')}
              onApproveSlot={handleApproveSlot}
              onRejectSlot={handleRejectSlot}
              onOpenCandidateSlots={(candidateName) => {
                const candidate = candidates.find(
                  (c) => c.name === candidateName,
                );
                const candidateSlots = slots.filter(
                  (s) => s.name === candidateName,
                );
                setSelectedSlotsCandidate({
                  name: candidateName,
                  candidate: candidate || null,
                  slots: candidateSlots,
                });
              }}
            />
          )
        ) : activeTab === 'hrs' ? (
          <AdminHRsTable
            hrs={filteredHRs}
            totalCount={hrs.length}
            search={hrSearch}
            onBackToHome={() => setActiveTab('home')}
            onChangeSearch={setHrSearch}
            onAddHR={(data) => {
              const nextId = hrs.length
                ? Math.max(...hrs.map((h) => h.id)) + 1
                : 1;
              const newHr = {
                id: nextId,
                name: data.name || `HR ${nextId}`,
                email: data.email || '',
                mobile: data.mobile || '',
                company: data.company || '',
                technology: data.technology || '',
                jobType: data.jobType || '',
                addedBy: data.addedBy || '',
              };
              setHrs((prev) => [...prev, newHr]);
            }}
            onUpdateHR={(id, data) => {
              setHrs((prev) =>
                prev.map((hr) =>
                  hr.id === id
                    ? {
                        ...hr,
                        name: data.name ?? hr.name,
                        email: data.email ?? hr.email,
                        mobile: data.mobile ?? hr.mobile,
                        company: data.company ?? hr.company,
                        technology: data.technology ?? hr.technology,
                        jobType: data.jobType ?? hr.jobType,
                      }
                    : hr,
                ),
              );
            }}
          />
        ) : activeTab === 'stats' ? (
          <AdminStatisticsChart />
        ) : activeTab === 'leaves' ? (
          <AdminLeavesTable onBackToHome={() => setActiveTab('home')} />
        ) : (
          <div className="min-h-[70vh] overflow-hidden rounded-lg sm:rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-6">
            {/* Admin calendar header - match screenshot */}
            <div className="border-b border-slate-200 pb-3 sm:pb-4">
              <div className="relative flex items-center justify-between gap-3">
                {/* Left: Today (no date text) */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 w-32 min-w-0">
                  <CalendarIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span className="font-medium truncate">Today</span>
                </div>

                {/* Center: Slot Booking Calendar */}
                <span className="absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm font-semibold text-purple-600">
                  Slot Booking Calendar
                </span>

                {/* Right: Download button only (stats are in CalendarToolbar below) */}
                <div className="flex items-center justify-end">
                  <a
                    href="/interview_process_candidate_details.pdf"
                    download="Personal_Detail_Form.pdf"
                    className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-sky-600 whitespace-nowrap"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 3v12" />
                      <path d="M8 11l4 4 4-4" />
                      <rect x="4" y="17" width="16" height="3" rx="1" />
                    </svg>
                    <span>Download Personal Detail Form</span>
                  </a>
                </div>
              </div>

              {/* Same CalendarToolbar as home: forward + today, range, totals */}
              <div className="mt-3">
                <CalendarToolbar
                  today={today}
                  rangeLabel={rangeLabel}
                  onNextWeek={handleNextWeek}
                  onToday={handleToday}
                  todaysSlotsCount={todaysSlotsCount}
                  weeklySlotsCount={weekSlotsCount}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <SlotCalendar today={today} weekStart={weekStart} events={ADMIN_EVENTS} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

