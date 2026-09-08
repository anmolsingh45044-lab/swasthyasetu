import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, CircleDashed, Truck, Droplet, Wind } from 'lucide-react';
import { bloodService } from '../../services/bloodService';
import { requestService } from '../../services/requestService';

const STATUS_FLOW = ['PENDING', 'APPROVED', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const normalizeStatus = (status) => {
  const map = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    READY_FOR_PICKUP: 'READY_FOR_PICKUP',
    PICKED_UP: 'PICKED_UP',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    Pending: 'PENDING',
    Accepted: 'APPROVED',
    Rejected: 'REJECTED',
    Fulfilled: 'DELIVERED',
    Cancelled: 'REJECTED',
    Assigned: 'APPROVED',
    'Picked Up': 'PICKED_UP',
    'In Transit': 'OUT_FOR_DELIVERY',
    Delivered: 'DELIVERED'
  };
  return map[status] || status || 'PENDING';
};

export default function TrackRequestPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await requestService.getRequestById(requestId);
        const data = response?.data?.request || response?.data?.delivery?.request || null;
        setRequest(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Request not found.');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) load();
  }, [requestId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="text-lg font-semibold text-ink">Loading request details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <h1 className="text-3xl font-semibold">Request not found</h1>
        <p className="mt-2 text-ink/60">{error || 'We could not locate this emergency request.'}</p>
      </div>
    );
  }

  const currentStatus = normalizeStatus(request.status);
  const currentStep = STATUS_FLOW.indexOf(currentStatus);
  const isBlood = Boolean(request.bloodGroup);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Request Tracking</p>
            <h1 className="mt-2 text-3xl font-semibold">{request.requestId || requestId}</h1>
          </div>
          <div className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
            {currentStatus.replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <div className="mb-5 flex items-center gap-3">
            {isBlood ? <Droplet className="text-rose-500" /> : <Wind className="text-rose-500" />}
            <h2 className="text-xl font-semibold">Request timeline</h2>
          </div>

          <div className="space-y-4">
            {STATUS_FLOW.map((step, idx) => {
              const isActive = idx <= currentStep;
              return (
                <div key={step} className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isActive ? 'bg-rose-500 text-white' : 'bg-mist text-ink/40'}`}>
                    {isActive ? <Check size={16} /> : idx + 1}
                  </div>
                  <div className="flex-1 rounded-xl border border-black/5 bg-mist px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-medium ${isActive ? 'text-ink' : 'text-ink/40'}`}>{step.replace(/_/g, ' ')}</span>
                      {idx === currentStep && <CircleDashed size={15} className="text-rose-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold">Request Summary</h3>
            <dl className="mt-4 space-y-2 text-sm text-ink/70">
              <div className="flex justify-between gap-3"><dt>Type</dt><dd>{isBlood ? 'Blood' : request.resourceType || 'Oxygen'}</dd></div>
              <div className="flex justify-between gap-3"><dt>Patient</dt><dd>{request.patientName || request.requestedBy?.name || 'Patient'}</dd></div>
              <div className="flex justify-between gap-3"><dt>Quantity</dt><dd>{request.units || request.quantity || 1}</dd></div>
              <div className="flex justify-between gap-3"><dt>Address</dt><dd>{request.deliveryAddress || 'Not specified'}</dd></div>
              <div className="flex justify-between gap-3"><dt>ETA</dt><dd>10 minutes</dd></div>
            </dl>
          </div>

          <div className="card bg-mist">
            <div className="flex items-center gap-2 text-ink">
              <Truck size={18} className="text-rose-500" />
              <h3 className="font-semibold">Delivery status</h3>
            </div>
            <p className="mt-3 text-sm text-ink/70">
              {currentStatus === 'DELIVERED'
                ? 'Your emergency resource has been delivered successfully.'
                : currentStatus === 'OUT_FOR_DELIVERY'
                  ? 'Your emergency resource is out for delivery to the patient address.'
                  : currentStatus === 'READY_FOR_PICKUP'
                    ? 'The resource is ready for pickup from the facility.'
                    : currentStatus === 'APPROVED'
                      ? 'The hospital has approved the request and is arranging pickup.'
                      : 'Your request is still under review.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
