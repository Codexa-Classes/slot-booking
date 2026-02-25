import React, { useState, useEffect } from 'react';

// Navigation Bar Component
export default function Navbar({ onOpenAddHR, onNavChange, activeNav: activeNavProp }) {
  const [active, setActive] = useState(activeNavProp || 'home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'fa-solid fa-house' },
    { id: 'slots', label: 'Slots', icon: 'fa-solid fa-calendar' },
    { id: 'hrs', label: 'HRs', icon: 'fa-solid fa-users' },
  ];

  // Sync internal state with prop
  useEffect(() => {
    if (activeNavProp !== undefined) {
      setActive(activeNavProp);
    }
  }, [activeNavProp]);

  const handleNavClick = (id) => {
    setActive(id);
    setMobileOpen(false);
    if (typeof onNavChange === 'function') {
      onNavChange(id);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex bg-white px-6 md:px-10 py-3 gap-3 items-center shadow-sm">
        {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavClick(item.id);
                if (item.id === 'hrs' && typeof onOpenAddHR === 'function') {
                  onOpenAddHR();
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === item.id
                  ? 'bg-purple-100 text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <i className={`${item.icon} w-5 h-5`} style={{ width: '1.25rem', height: '1.25rem' }} aria-hidden="true" />
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </button>
          ))}
      </div>

      {/* Mobile nav is handled by the header hamburger; hide Navbar mobile UI */}
    </>
  );
}