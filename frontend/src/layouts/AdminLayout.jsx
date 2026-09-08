import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-mist/40">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
