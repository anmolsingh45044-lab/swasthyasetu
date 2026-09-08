import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Droplet,
  BedDouble,
  Wind,
  ClipboardList,
  Truck,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/facilities', label: 'Facilities', icon: Building2 },
  { to: '/admin/blood', label: 'Blood', icon: Droplet },
  { to: '/admin/beds', label: 'Beds', icon: BedDouble },
  { to: '/admin/oxygen', label: 'Oxygen', icon: Wind },
  { to: '/admin/requests', label: 'Requests', icon: ClipboardList },
  { to: '/admin/deliveries', label: 'Deliveries', icon: Truck },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-black/5 bg-white px-4 py-6 md:flex">
      <div className="mb-8 px-2">
        <Logo to="/admin/dashboard" />
        <p className="mt-1 pl-1 text-xs font-semibold uppercase tracking-wide text-rose-500">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-rose-50 text-rose-600' : 'text-ink/70 hover:bg-mist'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/60 hover:bg-mist"
      >
        <LogOut size={18} /> Log out
      </button>
    </aside>
  );
}
