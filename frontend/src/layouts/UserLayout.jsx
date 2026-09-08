import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../components/layout/UserNavbar';
import BottomNav from '../components/layout/BottomNav';

export default function UserLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-mist/40">
      <UserNavbar />
      <main className="flex-1 pb-20 md:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
