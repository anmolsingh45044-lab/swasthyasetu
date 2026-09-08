import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/common/States';
import { UnauthorizedState } from '../components/common/States';

// Gates admin pages on req.user.role as returned by the backend (which in
// turn reads straight from MongoDB). There is no client-side toggle that
// can satisfy this check - isAdmin only ever comes from AuthContext, which
// only ever comes from the /auth/me and /auth/login API responses.
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingState label="Verifying access..." />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <UnauthorizedState />
      </div>
    );
  }

  return children;
}
