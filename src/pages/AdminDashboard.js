import React from 'react';
import AdminDashboardView from '../view/AdminDashboard';

// Wrapper component so we can hook into routing/guards
// without changing the existing admin dashboard UI structure.
export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}

