import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-ink/60">Your admin account details.</p>

      <div className="card mt-6 space-y-3">
        <div>
          <p className="label">Name</p>
          <p className="text-ink">{user?.name}</p>
        </div>
        <div>
          <p className="label">Email</p>
          <p className="text-ink">{user?.email}</p>
        </div>
        <div>
          <p className="label">Role</p>
          <span className="inline-block rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">Admin</span>
        </div>
      </div>

      <div className="card mt-4 bg-mist">
        <p className="text-sm text-ink/60">
          Admin status is controlled directly in MongoDB and can only be granted by an existing admin from the Users
          page. It cannot be changed from the frontend, browser storage, or the URL.
        </p>
      </div>
    </div>
  );
}
