import React, { useState } from 'react';
import { HomeIcon, CalendarIcon, UsersIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';


// Navigation Bar Component
export default function Navbar() {
  const [active, setActive] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'slots', label: 'Slots', icon: CalendarIcon },
    { id: 'hrs', label: 'HRs', icon: UsersIcon },
  ];

  const handleNavClick = (id) => {
    setActive(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex bg-white border-b border-gray-200 px-4 md:px-8 py-2 md:py-3 gap-2 md:gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all ${
                active === item.id
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
       
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"
        >
          {mobileOpen ? (
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <Bars3Icon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed left-0 top-14 bottom-0 w-16 bg-white border-r border-gray-200 shadow-lg z-40 overflow-y-auto">
          <div className="flex flex-col gap-2 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-center p-2.5 rounded-lg transition-all relative group ${
                    active === item.id
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                  {/* Tooltip */}
                  <div className="absolute left-16 bg-gray-900 text-white text-xs rounded px-2 py-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}