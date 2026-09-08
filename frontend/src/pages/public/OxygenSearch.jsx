import React, { useState } from 'react';
import { Wind } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { oxygenService } from '../../services/oxygenService';
import { SearchBar } from '../../components/common/SearchFilter';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';
import DemoDataNote from '../../components/common/DemoDataNote';
import StatusBadge from '../../components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';

export default function OxygenSearch() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch(() => oxygenService.getOxygen(city ? { city } : {}), [city]);
  const oxygen = data?.oxygen || [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-semibold">Find Oxygen Cylinders</h1>
      <p className="mt-1 text-ink/60">Check oxygen availability at nearby facilities.</p>

      <div className="mt-6">
        <SearchBar value={city} onChange={setCity} placeholder="Search by city..." />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => navigate('/request/oxygen')} className="btn-primary">
          GET NOW — 10 MIN
        </button>
        <button onClick={() => navigate('/facilities')} className="btn-secondary">
          FIND NEAREST HOSPITAL
        </button>
      </div>

      <div className="my-6">
        <DemoDataNote />
      </div>

      {loading && <LoadingState label="Searching oxygen availability..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && oxygen.length === 0 && <EmptyState title="No oxygen cylinders found near this location." icon={Wind} />}

      {!loading && !error && oxygen.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {oxygen.map((item) => (
            <div key={item._id} className="card">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink/60">{item.cylinderType}</span>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-3 text-2xl font-semibold text-ink">{item.availableCylinders} cylinders</p>
              <p className="font-medium text-ink">{item.facility?.name}</p>
              <p className="text-sm text-ink/50">{item.facility?.city}</p>
              <button onClick={() => navigate('/request/oxygen')} className="btn-primary mt-4 w-full !py-2 text-sm">
                Request Oxygen
              </button>
              <p className="mt-2 text-xs text-ink/40">Last updated {new Date(item.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
