import React, { useState } from 'react';
import { Droplet } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { bloodService } from '../../services/bloodService';
import { BLOOD_GROUPS } from '../../constants';
import { FilterPanel, SearchBar } from '../../components/common/SearchFilter';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';
import DemoDataNote from '../../components/common/DemoDataNote';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BloodSearch() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useFetch(
    () => bloodService.getInventory({ ...(bloodGroup && { bloodGroup }), ...(city && { city }) }),
    [bloodGroup, city]
  );
  const inventory = (data?.inventory || []).filter((i) => i.units > 0);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-semibold">Find Blood</h1>
      <p className="mt-1 text-ink/60">Search available blood units by group and location.</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <SearchBar value={city} onChange={setCity} placeholder="Search by city..." />
      </div>
      <div className="mt-4">
        <FilterPanel label="Blood group" options={BLOOD_GROUPS} value={bloodGroup} onChange={setBloodGroup} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => navigate('/request/blood')} className="btn-primary">
          GET NOW — 10 MIN
        </button>
        <button onClick={() => navigate('/facilities')} className="btn-secondary">
          FIND NEAREST HOSPITAL
        </button>
      </div>

      <div className="my-6">
        <DemoDataNote />
      </div>

      {loading && <LoadingState label="Searching blood availability..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && inventory.length === 0 && (
        <EmptyState title="No blood units found near this location." icon={Droplet} />
      )}

      {!loading && !error && inventory.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inventory.map((item) => (
            <div key={item._id} className="card">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-rose-500 px-3 py-1 text-sm font-bold text-white">{item.bloodGroup}</span>
                <span className="text-sm font-medium text-ink/60">{item.units} units</span>
              </div>
              <p className="mt-3 font-semibold text-ink">{item.facility?.name}</p>
              <p className="text-sm text-ink/50">{item.facility?.city}</p>
              <button
                onClick={() => (isAuthenticated ? navigate('/patient/dashboard') : navigate('/request/blood'))}
                className="btn-primary mt-4 w-full !py-2 text-sm"
              >
                Request Blood
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
