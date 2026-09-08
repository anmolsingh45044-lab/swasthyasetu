import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500 text-white">
        <HeartPulse size={18} strokeWidth={2.5} />
      </span>
      <span className="font-display text-lg font-semibold leading-none text-ink">
        Swasthya <span className="text-rose-500">Setu</span>
      </span>
    </Link>
  );
}
