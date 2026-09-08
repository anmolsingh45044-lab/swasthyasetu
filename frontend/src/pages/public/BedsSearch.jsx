import React, { useState } from 'react';
import { BedDouble } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { bedService } from '../../services/bedService';
import { BED_TYPES } from '../../constants';
import { FilterPanel, SearchBar } from '../../components/common/SearchFilter';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';
import DemoDataNote from '../../components/common/DemoDataNote';

export default function BedsSearch() {
  const [bedType, setBedType] = useState('');
  const [city, setCity] = useState('');
  const { data, loading, error, refetch } = useFetch(
    () => bedService.getBeds({ ...(bedType && { bedType }), ...(city && { city }) }),
    [bedType, city]
  );
  const beds = data?.beds || [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-semibold">Find Hospital Beds</h1>
      <p className="mt-1 text-ink/60">Search available beds by type and location.</p>

      <div className="mt-6">
        <SearchBar value={city} onChange={setCity} placeholder="Search by city..." />
      </div>
      <div className="mt-4">
        <FilterPanel label="Bed type" options={BED_TYPES} value={bedType} onChange={setBedType} />
      </div>

      <div className="my-6">
        <DemoDataNote />
      </div>

      {loading && <LoadingState label="Searching bed availability..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && beds.length === 0 && <EmptyState title="No beds currently available." icon={BedDouble} />}

      {!loading && !error && beds.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beds.map((bed) => (
            <div key={bed._id} className="card">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-rose-600">{bed.bedType}</span>
                <span className="text-sm font-semibold text-ink">
                  {bed.availableBeds}/{bed.totalBeds} free
                </span>
              </div>
              <p className="mt-3 font-semibold text-ink">{bed.facility?.name}</p>
              <p className="text-sm text-ink/50">{bed.facility?.city}</p>
              <p className="mt-2 text-xs text-ink/40">Last updated {new Date(bed.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
