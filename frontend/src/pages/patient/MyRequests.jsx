import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { bloodService } from '../../services/bloodService';
import { requestService } from '../../services/requestService';
import RequestCard from '../../components/common/RequestCard';
import { FilterPanel } from '../../components/common/SearchFilter';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';
import { REQUEST_STATUSES } from '../../constants';

export default function PatientRequests() {
  const [status, setStatus] = useState('');
  const bloodRequests = useFetch(() => bloodService.getRequests({ mine: 'true' }), []);
  const resourceRequests = useFetch(() => requestService.getResourceRequests({ mine: 'true' }), []);

  const loading = bloodRequests.loading || resourceRequests.loading;
  const error = bloodRequests.error || resourceRequests.error;

  let allRequests = [...(bloodRequests.data?.requests || []), ...(resourceRequests.data?.requests || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  if (status) allRequests = allRequests.filter((r) => r.status === status);

  const active = allRequests.filter((r) => ['Pending', 'Accepted'].includes(r.status));
  const past = allRequests.filter((r) => ['Fulfilled', 'Rejected', 'Cancelled'].includes(r.status));

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="text-2xl font-semibold">My Requests</h1>
      <p className="mt-1 text-ink/60">Track your current care and review past requests — your care continuity in one place.</p>

      <div className="mt-6">
        <FilterPanel options={REQUEST_STATUSES} value={status} onChange={setStatus} label="Filter by status" />
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <>
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Active</h2>
            {active.length === 0 ? (
              <EmptyState title="No active requests" icon={ClipboardList} />
            ) : (
              <div className="space-y-3">
                {active.map((r) => (
                  <RequestCard key={r._id} request={r} />
                ))}
              </div>
            )}
          </section>

          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Completed & past</h2>
            {past.length === 0 ? (
              <EmptyState title="No completed requests yet" icon={ClipboardList} />
            ) : (
              <div className="space-y-3">
                {past.map((r) => (
                  <RequestCard key={r._id} request={r} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
