import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const links = [
  { to: '/', label: 'Home' },
  { to: '/facilities', label: 'Hospitals' },
  { to: '/blood', label: 'Blood' },
  { to: '/beds', label: 'Beds' },
  { to: '/oxygen', label: 'Oxygen' },
  { to: '/how-it-works', label: 'How It Works' }
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-rose-600' : 'text-ink/70 hover:text-ink'}`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-secondary !px-5 !py-2 text-sm">
            Login
          </Link>
        </div>

        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-cream px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-sm font-medium text-ink/80">
                {link.label}
              </NavLink>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-full">
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
