import React from 'react';

export default function StatCard({ label, value, icon: Icon, tone = 'default', suffix }) {
  const toneClasses =
    tone === 'critical'
      ? 'bg-rose-50 text-critical'
      : tone === 'brand'
      ? 'bg-rose-500 text-white'
      : 'bg-mist text-rose-600';

  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClasses}`}>
        {Icon && <Icon size={22} strokeWidth={2} />}
      </div>
      <div>
        <p className="text-2xl font-semibold text-ink">
          {value}
          {suffix && <span className="ml-1 text-sm font-normal text-ink/50">{suffix}</span>}
        </p>
        <p className="text-sm text-ink/60">{label}</p>
      </div>
    </div>
  );
}
