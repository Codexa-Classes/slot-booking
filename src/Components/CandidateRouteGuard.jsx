import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import CandidateDashboard from '../view/CandidateDashboard';

/**
 * Route-level guard for /candidate-dashboard (and /candidate-event-list).
 * Verifies session and that candidate is still active (admin may have deactivated).
 */
export default function CandidateRouteGuard() {
  const [state, setState] = useState('checking'); // 'checking' | 'allow' | 'redirect'
  const [redirectTo, setRedirectTo] = useState('/login');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const raw = sessionStorage.getItem('sb_user');
        const parsed = raw ? JSON.parse(raw) : null;
        const role = (parsed?.role || '').trim().toLowerCase();

        if (!parsed?.mobile) {
          if (!cancelled) setRedirectTo('/login');
          if (!cancelled) setState('redirect');
          return;
        }
        if (role === 'admin') {
          if (!cancelled) setRedirectTo('/admin-dashboard');
          if (!cancelled) setState('redirect');
          return;
        }

        // For candidates: verify they are still active (admin may have deactivated)
        const candidateId = String(parsed?.id || '').trim();
        if (candidateId) {
          const candidateRef = doc(db, 'candidates', candidateId);
          const snap = await getDoc(candidateRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.isActive === false) {
              sessionStorage.removeItem('sb_user');
              localStorage.removeItem('candidates');
              localStorage.removeItem('name');
              localStorage.removeItem('email');
              localStorage.removeItem('uid');
              if (!cancelled) setRedirectTo('/login');
              if (!cancelled) setState('redirect');
              return;
            }
          }
        }

        if (!cancelled) setState('allow');
      } catch {
        if (!cancelled) setRedirectTo('/login');
        if (!cancelled) setState('redirect');
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  if (state === 'redirect') {
    return <Navigate to={redirectTo} replace />;
  }
  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-purple-600 font-medium">Loading…</span>
      </div>
    );
  }
  return <CandidateDashboard />;
}
