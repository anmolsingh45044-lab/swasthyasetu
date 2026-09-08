import React from 'react';
import StatusBadge from './StatusBadge';

export default function RequestCard({ request, primaryAction }) {
  const isBlood = !!request.bloodGroup;
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">{request.requestId || request._id}</p>
          <p className="text-lg font-semibold text-ink">
            {isBlood ? `${request.bloodGroup} · ${request.units} unit(s)` : request.resourceType}
          </p>
          <p className="text-sm text-ink/60">{request.facility?.name || 'Facility not specified'}</p>
        </div>
        <StatusBadge status={request.urgency || request.status} />
      </div>

      {request.patientName && <p className="text-sm text-ink/70">Patient: {request.patientName}</p>}
      {request.details && <p className="text-sm text-ink/70">{request.details}</p>}

      <div className="flex items-center justify-between border-t border-black/5 pt-3 text-sm">
        <span className="text-ink/50">{new Date(request.createdAt).toLocaleDateString()}</span>
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          {primaryAction}
        </div>
      </div>
    </div>
  );
}
