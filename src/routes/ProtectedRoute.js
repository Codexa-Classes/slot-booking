import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function FullscreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-600">Checking authentication…</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ requiredRole }) {
  const { currentUser, role, loading } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute] state:', {
    hasUser: !!currentUser,
    uid: currentUser?.uid,
    role,
    loading,
    requiredRole,
    pathname: location.pathname,
  });

  if (loading) {
    return <FullscreenLoader />;
  }

  if (!currentUser) {
    console.warn('[ProtectedRoute] No user, redirecting to /login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole) {
    console.warn('[ProtectedRoute] Unauthorized, redirecting to /login', {
      requiredRole,
      role,
    });
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

