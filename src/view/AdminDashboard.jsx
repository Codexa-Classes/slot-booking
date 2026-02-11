import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import SlotCalendar from '../Components/SlotCalendar';
import { adminLogout } from './AdminLogin';
import {
  FIXED_TODAY,
  getWeekStart,
  getWeekDays,
  formatWeekRangeLabel,
  parseISOToDate,
  isSameDay,
  formatHeaderToday,
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4v6h6" />
              <path d="M20 20v-6h-6" />
              <path d="M5 19A9 9 0 0 1 5 5l1-1" />
              <path d="M19 5a9 9 0 0 1 0 14l-1 1" />
            </svg>
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
        {/* Left: count of candidates */}
        <div className="text-[11px] sm:text-xs text-slate-600">
          <span className="text-base sm:text-sm font-semibold text-slate-800">
            {candidates.length}
          </span>{' '}
          Total Candidates
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

          {/* All dropdown */}
          <select
            value={filter}
            onChange={(e) => onChangeFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] sm:text-xs text-slate-700"
          >
            <option value="all">All</option>
            <option value="selected">Selected</option>
            <option value="unselected">Unselected</option>
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
                      <i className="fa-solid fa-rotate-right" aria-hidden="true" />
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
    technology: '',
    payment: '',
    referredBy: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeftIcon className="w-4 h-4 text-slate-600" />
          </button>
          <h2 className="text-sm sm:text-base font-semibold text-purple-600">
            Add New Candidate
          </h2>
        </div>
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

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            * Password
          </label>
          <div className="flex">
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
            >
              {showPassword ? (
                <span className="text-xs">🙈</span>
              ) : (
                <span className="text-xs">👁</span>
              )}
            </button>
          </div>
        </div>

        {/* Technology */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            * Technology
          </label>
          <select
            value={form.technology}
            onChange={handleChange('technology')}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="">Choose Technologies...</option>
            <option value="Python">Python</option>
            <option value="React Developer">React Developer</option>
            <option value="MEAN Stack">MEAN Stack</option>
            <option value="Manual Testing">Manual Testing</option>
          </select>
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

        {/* Referred By */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            * Referred By
          </label>
          <input
            type="text"
            value={form.referredBy}
            onChange={handleChange('referredBy')}
            placeholder="Select Referred By"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
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

function AdminSlotsTable({
  slots,
  filter,
  search,
  onChangeFilter,
  onChangeSearch,
  onBackToHome,
  onApproveSlot,
  onRejectSlot,
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
        {/* Left: metrics */}
        <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-700">
          <div>
            <span className="font-semibold">{totalSlots}</span>{' '}
            <span className="text-slate-500">Total Slots</span>
          </div>
          <div>
            <span className="font-semibold">12</span>{' '}
            <span className="text-slate-500">Last Week</span>
          </div>
          <div>
            <span className="font-semibold">11</span>{' '}
            <span className="text-slate-500">This Week</span>
          </div>
          <div>
            <span className="font-semibold">13</span>{' '}
            <span className="text-slate-500">Avg/Week</span>
          </div>
          <div>
            <span className="font-semibold">1.9</span>{' '}
            <span className="text-slate-500">Avg/Day</span>
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
                  <td className="px-3 py-2 text-purple-600 font-semibold cursor-pointer">
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

function AdminLeavesTable({ onBackToHome }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
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
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-lime-500 px-3 sm:px-4 py-2 text-[11px] sm:text-sm font-semibold text-white shadow hover:bg-lime-600 whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            Add Leave
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="px-3 py-2 text-left font-semibold border-b border-slate-200">
                Date <span className="text-purple-600">⇵</span>
              </th>
              <th className="px-3 py-2 text-right font-semibold border-b border-slate-200 w-28">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-6 text-slate-500" colSpan={2}>
                No leaves found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer pagination */}
      <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-500">
        <button className="px-2 py-1 rounded hover:bg-slate-50" aria-label="First page">
          &laquo;
        </button>
        <button className="px-2 py-1 rounded hover:bg-slate-50" aria-label="Previous page">
          &lsaquo;
        </button>
        <button className="px-2 py-1 rounded hover:bg-slate-50" aria-label="Next page">
          &rsaquo;
        </button>
        <button className="px-2 py-1 rounded hover:bg-slate-50" aria-label="Last page">
          &raquo;
        </button>

        <select className="ml-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
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
    return ADMIN_EVENTS.filter((event) => {
      const eventDate = parseISOToDate(event.start);
      return isSameDay(eventDate, FIXED_TODAY);
    }).length;
  }, []);

  const weekSlotsCount = useMemo(() => {
    return ADMIN_EVENTS.filter((event) => {
      const d = parseISOToDate(event.start);
      return d >= weekStart && d <= weekEnd;
    }).length;
  }, [weekStart, weekEnd]);

  const todayHeaderLabel = useMemo(
    () => formatHeaderToday(FIXED_TODAY),
    [],
  );

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
      if (candidateSearch.trim()) {
        const q = candidateSearch.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.mobile.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [candidates, candidateFilter, candidateSearch]);

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const handleToday = () => {
    setWeekStart(getWeekStart(FIXED_TODAY));
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
      alert(`View candidate:\n${candidate.name} (${candidate.mobile})`);
    }
  };

  const handleEditCandidate = (id) => {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      alert(`Edit candidate (placeholder):\n${candidate.name}`);
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
                  technologies: data.technology ? [data.technology] : [],
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
          <AdminSlotsTable
            slots={filteredSlots}
            filter={slotFilter}
            search={slotSearch}
            onChangeFilter={setSlotFilter}
            onChangeSearch={setSlotSearch}
            onBackToHome={() => setActiveTab('home')}
            onApproveSlot={handleApproveSlot}
            onRejectSlot={handleRejectSlot}
          />
        ) : activeTab === 'leaves' ? (
          <AdminLeavesTable onBackToHome={() => setActiveTab('home')} />
        ) : (
          <div className="min-h-[70vh] overflow-hidden rounded-lg sm:rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-6">
            {/* Admin calendar header - match screenshot */}
            <div className="border-b border-slate-200 pb-3 sm:pb-4">
              <div className="flex items-center justify-between gap-3">
                {/* Left: Today label */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                  <CalendarIcon className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">
                    Today: {todayHeaderLabel}
                  </span>
                </div>

                {/* Center: Title */}
                <button
                  type="button"
                  className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  Slot Booking Calendar
                </button>

                {/* Right: Download button + stats */}
                <div className="flex items-center gap-3">
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
                  <div className="hidden sm:flex items-center gap-6 text-[11px] text-slate-600">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-slate-900">
                        {todaysSlotsCount}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Total Slots
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Today
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-slate-900">
                        {weekSlotsCount}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Total This Week
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Slots
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second row: week nav + range */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleNextWeek}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white text-sm shadow hover:bg-slate-800"
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    onClick={handleToday}
                    className="rounded-md border border-purple-300 px-3 py-1 text-xs font-semibold text-purple-600 bg-white hover:bg-purple-50"
                  >
                    today
                  </button>
                </div>
                <div className="flex-1 text-center text-sm sm:text-base font-semibold text-slate-900">
                  {rangeLabel}
                </div>
                <div className="w-16 sm:w-24" />
              </div>
            </div>

            <div className="mt-4">
              <SlotCalendar weekStart={weekStart} events={ADMIN_EVENTS} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

