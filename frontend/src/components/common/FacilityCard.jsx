import React from 'react';
import { MapPin, Navigation2, Droplet, BedDouble, Wind } from 'lucide-react';

export default function FacilityCard({ facility, onViewDetails, onFindRoute, onRequestHelp }) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-rose-500">{facility.type}</p>
          <h3 className="mt-0.5 text-lg font-semibold text-ink">{facility.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink/60">
            <MapPin size={14} /> {facility.city}
            {facility.distanceKm != null && <span className="text-ink/40">· {facility.distanceKm} km away</span>}
          </p>
        </div>
      </div>

      {facility.availability && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl bg-mist py-2">
            <Droplet size={14} className="mx-auto mb-1 text-rose-500" />
            <p className="font-semibold text-ink">{facility.availability.blood}</p>
            <p className="text-ink/50">Blood units</p>
          </div>
          <div className="rounded-xl bg-mist py-2">
            <BedDouble size={14} className="mx-auto mb-1 text-rose-500" />
            <p className="font-semibold text-ink">{facility.availability.beds}</p>
            <p className="text-ink/50">Beds</p>
          </div>
          <div className="rounded-xl bg-mist py-2">
            <Wind size={14} className="mx-auto mb-1 text-rose-500" />
            <p className="font-semibold text-ink">{facility.availability.oxygen}</p>
            <p className="text-ink/50">Oxygen</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-black/5 pt-3">
        <button onClick={() => onViewDetails?.(facility)} className="btn-secondary flex-1 !py-2 text-xs">
          View Details
        </button>
        <button onClick={() => onFindRoute?.(facility)} className="btn-secondary flex-1 !py-2 text-xs">
          <Navigation2 size={14} /> Find Route
        </button>
        <button onClick={() => onRequestHelp?.(facility)} className="btn-primary flex-1 !py-2 text-xs">
          Request Help
        </button>
      </div>
    </div>
  );
}
