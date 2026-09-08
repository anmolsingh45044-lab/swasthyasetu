import React from 'react';
import { Truck, Check } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { deliveryService } from '../../services/deliveryService';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';
import { DELIVERY_STATUSES } from '../../constants';

const normalizeDeliveryStatus = (status) => {
  const map = {
    PENDING: 'PENDING',
    ASSIGNED: 'ASSIGNED',
    PICKED_UP: 'PICKED_UP',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    Pending: 'PENDING',
    Assigned: 'ASSIGNED',
    'Picked Up': 'PICKED_UP',
    'In Transit': 'OUT_FOR_DELIVERY',
    Delivered: 'DELIVERED'
  };
  return map[status] || status;
};

export default function AdminDeliveries() {
  const { data, loading, error, refetch } = useFetch(() => deliveryService.getDeliveries(), []);
  const deliveries = data?.deliveries || [];

  const handleAdvance = async (delivery) => {
    const currentStatus = normalizeDeliveryStatus(delivery.status);
    const currentIdx = DELIVERY_STATUSES.indexOf(currentStatus);
    const next = DELIVERY_STATUSES[currentIdx + 1] || null;
    if (!next) return;
    await deliveryService.updateDeliveryStatus(delivery._id, next);
    refetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Deliveries</h1>
      <p className="mt-1 text-ink/60">Track and update the care route for every request.</p>

      <div className="mt-6">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && deliveries.length === 0 && <EmptyState title="No deliveries yet" icon={Truck} />}
        {!loading && !error && deliveries.length > 0 && (
          <div className="space-y-4">
            {deliveries.map((d) => {
              const currentStatus = normalizeDeliveryStatus(d.status);
              const currentIdx = DELIVERY_STATUSES.indexOf(currentStatus);
              return (
                <div key={d._id} className="card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-ink/40">Request ID: {d.request?.requestId || d.request?._id}</p>
                      <p className="font-semibold text-ink">
                        {d.requestType === 'BloodRequest' ? 'Blood' : d.request?.resourceType} for{' '}
                        {d.request?.requestedBy?.name || d.request?.patientName || 'patient'}
                      </p>
                      <p className="text-sm text-ink/60">From: {d.pickupFacility?.name || 'Not assigned'}</p>
                    </div>
                    {currentIdx < DELIVERY_STATUSES.length - 1 && (
                      <button onClick={() => handleAdvance(d)} className="btn-primary !py-1.5 text-xs">
                        Advance to {DELIVERY_STATUSES[currentIdx + 1]}
                      </button>
                    )}
                  </div>

                  <div className="mt-5 flex items-center">
                    {DELIVERY_STATUSES.filter((s) => ['PENDING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s)).map((s, idx) => (
                      <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                              idx <= currentIdx ? 'bg-rose-500 text-white' : 'bg-mist text-ink/40'
                            }`}
                          >
                            {idx <= currentIdx ? <Check size={13} /> : idx + 1}
                          </div>
                          <span className={`text-[11px] ${idx <= currentIdx ? 'text-ink' : 'text-ink/40'}`}>{s.replace(/_/g, ' ')}</span>
                        </div>
                        {idx < 4 && (
                          <div className={`mx-1 h-0.5 flex-1 ${idx < currentIdx ? 'bg-rose-500' : 'bg-mist'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
