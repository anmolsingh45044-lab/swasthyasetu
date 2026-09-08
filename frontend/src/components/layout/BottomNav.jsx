import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Droplet, BedDouble, MapPin, User } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export default function BottomNav() {
  const { activeMode } = useRole();

  const items =
    activeMode === 'donor'
      ? [
          { to: '/donor/dashboard', label: 'Home', icon: LayoutDashboard },
          { to: '/donor/donate', label: 'Donate', icon: Droplet },
          { to: '/donor/requests', label: 'Requests', icon: BedDouble },
          { to: '/facilities', label: 'Facilities', icon: MapPin },
          { to: '/profile', label: 'Profile', icon: User }
        ]
      : [
          { to: '/patient/dashboard', label: 'Home', icon: LayoutDashboard },
          { to: '/blood', label: 'Blood', icon: Droplet },
          { to: '/beds', label: 'Beds', icon: BedDouble },
          { to: '/facilities', label: 'Facilities', icon: MapPin },
          { to: '/profile', label: 'Profile', icon: User }
        ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-black/5 bg-white py-1.5 md:hidden">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${
              isActive ? 'text-rose-600' : 'text-ink/50'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
