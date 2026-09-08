import React, { useState } from 'react';
import { Droplet } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { bloodService } from '../../services/bloodService';
import RequestCard from '../../components/common/RequestCard';
import { FilterPanel } from '../../components/common/SearchFilter';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';
import { BLOOD_GROUPS } from '../../constants';

export default function DonorBloodRequests() {
  const [bloodGroup, setBloodGroup] = useState('');
  const { data, loading, error, refetch } = useFetch(
    () => bloodService.getRequests({ status: 'Pending', ...(bloodGroup && { bloodGroup }) }),
    [bloodGroup]
  );
  const requests = data?.requests || [];

  const handleAccept = async (id) => {
    await bloodService.acceptRequest(id);
    refetch();
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="text-2xl font-semibold">Blood Requests</h1>
      <p className="mt-1 text-ink/60">Browse pending requests and accept the ones you can help with.</p>

      <div className="mt-6">
        <FilterPanel options={BLOOD_GROUPS} value={bloodGroup} onChange={setBloodGroup} label="Blood group" />
      </div>

      <div className="mt-6">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && requests.length === 0 && <EmptyState title="No pending requests right now" icon={Droplet} />}
        {!loading && !error && requests.length > 0 && (
          <div className="space-y-3">
            {requests.map((r) => (
              <RequestCard
                key={r._id}
                request={r}
                primaryAction={
                  <button onClick={() => handleAccept(r._id)} className="btn-primary !py-1.5 text-xs">
                    Accept Request
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
