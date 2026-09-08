import React from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative flex-1">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10"
        aria-label={placeholder}
      />
    </div>
  );
}

export function FilterPanel({ options, value, onChange, label }) {
  return (
    <div>
      {label && <span className="label">{label}</span>}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange('')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === '' ? 'bg-rose-500 text-white' : 'bg-mist text-ink/70 hover:bg-rose-100'
          }`}
        >
          All
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              value === opt ? 'bg-rose-500 text-white' : 'bg-mist text-ink/70 hover:bg-rose-100'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
