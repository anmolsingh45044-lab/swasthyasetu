import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { bloodService } from '../../services/bloodService';
import { requestService } from '../../services/requestService';
import RequestCard from '../../components/common/RequestCard';
import { FilterPanel } from '../../components/common/SearchFilter';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';
import { REQUEST_STATUSES } from '../../constants';

const normalizeStatus = (status) => {
  const map = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    READY_FOR_PICKUP: 'READY_FOR_PICKUP',
    PICKED_UP: 'PICKED_UP',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    REJECTED: 'REJECTED',
    Pending: 'PENDING',
    Accepted: 'APPROVED',
    Rejected: 'REJECTED',
    Fulfilled: 'DELIVERED',
    Cancelled: 'REJECTED'
  };
  return map[status] || status;
};

export default function AdminRequests() {
  const [status, setStatus] = useState('');
  const bloodRequests = useFetch(() => bloodService.getRequests(status ? { status } : {}), [status]);
  const resourceRequests = useFetch(() => requestService.getResourceRequests(status ? { status } : {}), [status]);

  const loading = bloodRequests.loading || resourceRequests.loading;
  const error = bloodRequests.error || resourceRequests.error;
  const requests = [...(bloodRequests.data?.requests || []), ...(resourceRequests.data?.requests || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const updateStatus = async (r, newStatus) => {
    if (r.bloodGroup) {
      await bloodService.updateRequestStatus(r._id, newStatus);
      bloodRequests.refetch();
    } else {
      await requestService.updateResourceRequestStatus(r._id, newStatus);
      resourceRequests.refetch();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">All Requests</h1>
      <p className="mt-1 text-ink/60">Approve, reject or update the status of every request in the system.</p>

      <div className="mt-6">
        <FilterPanel options={REQUEST_STATUSES} value={status} onChange={setStatus} label="Filter by status" />
      </div>

      <div className="mt-6">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!loading && !error && requests.length === 0 && <EmptyState title="No requests found" icon={ClipboardList} />}
        {!loading && !error && requests.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {requests.map((r) => {
              const currentStatus = normalizeStatus(r.status);
              return (
                <RequestCard
                  key={r._id}
                  request={r}
                  primaryAction={
                    currentStatus === 'PENDING' || currentStatus === 'APPROVED' || currentStatus === 'READY_FOR_PICKUP' ? (
                      <div className="flex gap-1.5">
                        {currentStatus === 'PENDING' && (
                          <button onClick={() => updateStatus(r, 'APPROVED')} className="btn-secondary !py-1 !px-2.5 text-xs">
                            Approve
                          </button>
                        )}
                        {currentStatus === 'APPROVED' && (
                          <button onClick={() => updateStatus(r, 'READY_FOR_PICKUP')} className="btn-primary !py-1 !px-2.5 text-xs">
                            Ready for pickup
                          </button>
                        )}
                        {currentStatus !== 'REJECTED' && (
                          <button onClick={() => updateStatus(r, 'REJECTED')} className="text-xs font-semibold text-critical">
                            Reject
                          </button>
                        )}
                      </div>
                    ) : null
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
