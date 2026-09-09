import React from 'react';
import {
  MapPin,
  Navigation2,
  Droplet,
  BedDouble,
  Wind,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FacilityCard({
  facility,
  onRequestHelp,
}) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/hospital/${facility._id || facility.id}`);
  };

  const handleFindRoute = () => {
    const latitude = facility.latitude;
    const longitude = facility.longitude;

    if (latitude == null || longitude == null) {
      alert('Location coordinates are not available for this facility.');
      return;
    }

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      '_blank'
    );
  };

  const handleRequestHelp = () => {
    if (onRequestHelp) {
      onRequestHelp(facility);
      return;
    }

    navigate(`/requests/new?facility=${facility._id || facility.id}`);
  };

  return (
    <div className="card flex flex-col gap-4">

      {/* Facility Information */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-rose-500">
            {facility.type}
          </p>

          <h3 className="mt-0.5 text-lg font-semibold text-ink">
            {facility.name}
          </h3>

          <p className="mt-1 flex items-center gap-1 text-sm text-ink/60">
            <MapPin size={14} />

            {facility.city}

            {facility.distanceKm != null && (
              <span className="text-ink/40">
                · {facility.distanceKm} km away
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Availability */}
      {facility.availability && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">

          {/* Blood */}
          <div className="rounded-xl bg-mist py-2">
            <Droplet
              size={14}
              className="mx-auto mb-1 text-rose-500"
            />

            <p className="font-semibold text-ink">
              {facility.availability.blood ?? 0}
            </p>

            <p className="text-ink/50">
              Blood units
            </p>
          </div>

          {/* Beds */}
          <div className="rounded-xl bg-mist py-2">
            <BedDouble
              size={14}
              className="mx-auto mb-1 text-rose-500"
            />

            <p className="font-semibold text-ink">
              {facility.availability.beds ?? 0}
            </p>

            <p className="text-ink/50">
              Beds
            </p>
          </div>

          {/* Oxygen */}
          <div className="rounded-xl bg-mist py-2">
            <Wind
              size={14}
              className="mx-auto mb-1 text-rose-500"
            />

            <p className="font-semibold text-ink">
              {facility.availability.oxygen ?? 0}
            </p>

            <p className="text-ink/50">
              Oxygen
            </p>
          </div>

        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 border-t border-black/5 pt-3">

        {/* VIEW DETAILS */}
        <button
          type="button"
          onClick={handleViewDetails}
          className="btn-secondary flex-1 !py-2 text-xs"
        >
          View Details
        </button>

        {/* FIND ROUTE */}
        <button
          type="button"
          onClick={handleFindRoute}
          className="btn-secondary flex-1 !py-2 text-xs"
        >
          <Navigation2 size={14} />
          Find Route
        </button>

        {/* REQUEST HELP */}
        <button
          type="button"
          onClick={handleRequestHelp}
          className="btn-primary flex-1 !py-2 text-xs"
        >
          Request Help
        </button>

      </div>
    </div>
  );
}
