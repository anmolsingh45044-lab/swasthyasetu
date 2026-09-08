import React from 'react';
import { EmptyState } from '../common/States';

export default function ChartCard({ title, subtitle, children, isEmpty }) {
  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-sm text-ink/50">{subtitle}</p>}
      </div>
      {isEmpty ? <EmptyState title="No data yet" description="Data will appear here once records are added." /> : children}
    </div>
  );
}
