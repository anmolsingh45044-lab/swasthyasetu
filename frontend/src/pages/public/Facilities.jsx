import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { facilityService } from '../../services/facilityService';
import FacilityCard from '../../components/common/FacilityCard';
import { SearchBar } from '../../components/common/SearchFilter';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';
import DemoDataNote from '../../components/common/DemoDataNote';
import MapView from '../../components/map/MapView';

export default function Facilities() {
  const [city, setCity] = useState('');
  const { data, loading, error, refetch } = useFetch(() => facilityService.getFacilities(city ? { city } : {}), [city]);
  const facilities = data?.facilities || [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-semibold">Facility Discovery</h1>
      <p className="mt-1 text-ink/60">Find nearby hospitals, health centres and blood banks.</p>

      <div className="mt-6 mb-4">
        <SearchBar value={city} onChange={setCity} placeholder="Search by city..." />
      </div>

      <div className="mb-6">
        <DemoDataNote />
      </div>

      {loading && <LoadingState label="Finding facilities..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && facilities.length > 0 && (
        <>
          <div className="mb-8">
            <MapView facilities={facilities} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f) => (
              <FacilityCard key={f._id} facility={f} />
            ))}
          </div>
        </>
      )}

      {!loading && !error && facilities.length === 0 && (
        <EmptyState title="No facilities found near this location." description="Try a different city or check back later." />
      )}
    </div>
  );
}
