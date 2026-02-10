import React, { useState } from 'react';
import { HomeIcon, CalendarIcon, UsersIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';


// Navigation Bar Component
export default function Navbar({ onOpenAddHR, onSelectHome, onSelectSlots, initialActive = 'home' }) {
  const [active, setActive] = useState(initialActive);
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
      <div className="hidden md:flex bg-white px-6 md:px-10 py-3 gap-3 items-center shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);

                if (item.id === 'home' && typeof onSelectHome === 'function') {
                  onSelectHome();
                } else if (item.id === 'slots' && typeof onSelectSlots === 'function') {
                  onSelectSlots();
                } else if (item.id === 'hrs' && typeof onOpenAddHR === 'function') {
                  onOpenAddHR();
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === item.id
                  ? 'bg-purple-100 text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
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
                  onClick={() => {
                    handleNavClick(item.id);
                    if (item.id === 'home' && typeof onSelectHome === 'function') {
                      onSelectHome();
                    } else if (item.id === 'slots' && typeof onSelectSlots === 'function') {
                      onSelectSlots();
                    } else if (item.id === 'hrs' && typeof onOpenAddHR === 'function') {
                      onOpenAddHR();
                    }
                  }}
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