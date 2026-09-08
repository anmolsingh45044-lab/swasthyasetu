import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Repeat } from 'lucide-react';
import Logo from './Logo';
import NotificationBell from './NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';

const patientLinks = [
  { to: '/patient/dashboard', label: 'Dashboard' },
  { to: '/blood', label: 'Find Blood' },
  { to: '/beds', label: 'Beds' },
  { to: '/oxygen', label: 'Oxygen' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/patient/requests', label: 'My Requests' }
];

const donorLinks = [
  { to: '/donor/dashboard', label: 'Dashboard' },
  { to: '/donor/donate', label: 'Donate Blood' },
  { to: '/donor/requests', label: 'Blood Requests' },
  { to: '/donor/donations', label: 'My Donations' },
  { to: '/facilities', label: 'Facilities' }
];

export default function UserNavbar() {
  const { user, logout } = useAuth();
  const { activeMode, switchMode } = useRole();
  const navigate = useNavigate();
  const links = activeMode === 'donor' ? donorLinks : patientLinks;

  const handleSwitch = async () => {
    const nextMode = activeMode === 'donor' ? 'patient' : 'donor';
    await switchMode(nextMode);
    navigate(nextMode === 'donor' ? '/donor/dashboard' : '/patient/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Logo to={activeMode === 'donor' ? '/donor/dashboard' : '/patient/dashboard'} />

        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-rose-600' : 'text-ink/70 hover:text-ink'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSwitch}
            className="hidden items-center gap-1.5 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 sm:flex"
          >
            <Repeat size={13} /> Switch to {activeMode === 'donor' ? 'Patient' : 'Donor'}
          </button>
          <NotificationBell />
          <div className="hidden text-sm text-ink/70 sm:block">Hi, {user?.name?.split(' ')[0]}</div>
          <button onClick={logout} className="rounded-full p-2 hover:bg-mist" aria-label="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <button
        onClick={handleSwitch}
        className="flex w-full items-center justify-center gap-1.5 border-t border-black/5 bg-mist py-2 text-xs font-semibold text-rose-600 sm:hidden"
      >
        <Repeat size={13} /> Switch to {activeMode === 'donor' ? 'Patient' : 'Donor'}
      </button>
    </header>
  );
}
