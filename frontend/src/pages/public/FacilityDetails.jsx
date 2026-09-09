import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { facilityService } from '../../services/facilityService';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Droplet,
  BedDouble,
  Wind,
  Navigation2
} from 'lucide-react';

export default function FacilityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(
    () => facilityService.getFacilityById(id),
    [id]
  );

  const facility = data?.facility || data?.data?.facility || data;

  const handleRoute = () => {
    if (facility?.latitude != null && facility?.longitude != null) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`,
        '_blank'
      );
    } else {
      alert('Location coordinates are not available.');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="card text-center">
          <p className="text-ink/60">Loading facility details...</p>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="card text-center">
          <h1 className="text-2xl font-semibold">
            Facility not found
          </h1>

          <p className="mt-2 text-ink/60">
            We couldn't load this facility.
          </p>

          <button
            type="button"
            onClick={() => navigate('/facilities')}
            className="btn-primary mt-6"
          >
            Back to Facilities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">

      <button
        type="button"
        onClick={() => navigate('/facilities')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-rose-500"
      >
        <ArrowLeft size={16} />
        Back to Facilities
      </button>

      <div className="card">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
              {facility.type || 'Healthcare Facility'}
            </p>

            <h1 className="mt-1 text-3xl font-semibold text-ink">
              {facility.name}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-ink/60">
              <MapPin size={17} />
              {facility.city || 'Location unavailable'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRoute}
            className="btn-secondary"
          >
            <Navigation2 size={16} />
            Find Route
          </button>

        </div>

        {(facility.phone || facility.contactNumber) && (
          <div className="mt-6 flex items-center gap-2 text-sm text-ink/70">
            <Phone size={16} />
            {facility.phone || facility.contactNumber}
          </div>
        )}
      </div>

      <div className="mt-6">

        <h2 className="mb-4 text-2xl font-semibold">
          Current Availability
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">

          <div className="card text-center">
            <Droplet
              size={28}
              className="mx-auto mb-3 text-rose-500"
            />

            <p className="text-3xl font-bold text-ink">
              {facility.availability?.blood ?? 0}
            </p>

            <p className="mt-1 text-sm text-ink/60">
              Blood Units
            </p>
          </div>

          <div className="card text-center">
            <BedDouble
              size={28}
              className="mx-auto mb-3 text-rose-500"
            />

            <p className="text-3xl font-bold text-ink">
              {facility.availability?.beds ?? 0}
            </p>

            <p className="mt-1 text-sm text-ink/60">
              Available Beds
            </p>
          </div>

          <div className="card text-center">
            <Wind
              size={28}
              className="mx-auto mb-3 text-rose-500"
            />

            <p className="text-3xl font-bold text-ink">
              {facility.availability?.oxygen ?? 0}
            </p>

            <p className="mt-1 text-sm text-ink/60">
              Oxygen Cylinders
            </p>
          </div>

        </div>
      </div>

      <div className="mt-8 card">

        <h2 className="text-xl font-semibold">
          Need Emergency Assistance?
        </h2>

        <p className="mt-2 text-sm text-ink/60">
          Request emergency blood or oxygen delivery from this facility.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(`/request/blood?facility=${facility._id}`)
            }
            className="btn-primary"
          >
            Request Blood
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(`/request/oxygen?facility=${facility._id}`)
            }
            className="btn-secondary"
          >
            Request Oxygen
          </button>

        </div>
      </div>

    </div>
  );
}