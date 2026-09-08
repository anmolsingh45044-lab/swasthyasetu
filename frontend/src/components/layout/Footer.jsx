import React from 'react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Logo />
            <p className="mt-2 max-w-sm text-sm text-ink/50">
              A unified platform connecting healthcare seekers to blood, beds, oxygen and facilities — built for
              rural and underserved communities.
            </p>
          </div>
          <p className="text-sm text-ink/40">Smart India Hackathon 2026 · Prototype</p>
        </div>
      </div>
    </footer>
  );
}
