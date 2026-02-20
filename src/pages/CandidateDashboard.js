import React from 'react';
import CandidateDashboardView from '../view/CandidateDashboard';

// Wrapper component so we can hook into routing/guards
// without changing the existing candidate dashboard UI.
export default function CandidateDashboardPage() {
  return <CandidateDashboardView />;
}

