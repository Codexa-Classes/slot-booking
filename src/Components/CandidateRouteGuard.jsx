import React from 'react';
import { Navigate } from 'react-router-dom';
import CandidateDashboard from '../view/CandidateDashboard';

/**
 * Route-level guard for /candidate-dashboard (and /candidate-event-list).
 * Runs synchronously so admins never see candidate UI when using back/forward.
 * Redirects with replace so the wrong dashboard is removed from history.
 */
export default function CandidateRouteGuard() {
  try {
    const raw = localStorage.getItem('sb_user');
    const parsed = raw ? JSON.parse(raw) : null;
    const role = (parsed?.role || '').trim().toLowerCase();

    if (!parsed?.mobile) {
      return <Navigate to="/login" replace />;
    }
    if (role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <CandidateDashboard />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
