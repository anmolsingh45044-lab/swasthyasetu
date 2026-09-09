import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Clock3, Droplet, Wind, ShieldCheck, MapPinned } from 'lucide-react';
import { BLOOD_GROUPS } from '../../constants';
import { bloodService } from '../../services/bloodService';
import { requestService } from '../../services/requestService';

const STATUS_FLOW = [
  'Request Received',
  'Hospital Approved',
  'Resource Ready',
  'Out for Delivery',
  'Delivered'
];

export default function EmergencyRequestPage() {
 const { resourceType } = useParams();
const navigate = useNavigate();
const [searchParams] = useSearchParams();

const facilityId = searchParams.get('facility');

const isBlood = (resourceType || '').toLowerCase() === 'blood';
  const resourceLabel = isBlood ? 'Blood' : 'Oxygen';

  const initialForm = useMemo(
    () => ({
      patientName: '',
      mobileNumber: '',
      bloodGroup: 'O+',
      quantity: 1,
      deliveryAddress: '',
      urgency: 'Urgent'
    }),
    []
  );

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdRequest, setCreatedRequest] = useState(null);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = isBlood
       ? {
    patientName: form.patientName,
    mobileNumber: form.mobileNumber,
    bloodGroup: form.bloodGroup,
    units: Number(form.quantity),
    deliveryAddress: form.deliveryAddress,
    urgency: form.urgency,
   facility: facilityId,
    notes: 'Emergency blood delivery request'
  }
        : {
            patientName: form.patientName,
            mobileNumber: form.mobileNumber,
            resourceType: 'Oxygen Cylinder',
            quantity: Number(form.quantity),
            deliveryAddress: form.deliveryAddress,
            urgency: form.urgency,
            facility: facilityId,
            details: 'Emergency oxygen delivery request'
          };

      const res = isBlood
        ? await bloodService.createPublicRequest(payload)
        : await requestService.createPublicResourceRequest(payload);

      const requestId = res?.data?.requestId || res?.data?.request?.requestId;
      setCreatedRequest({ requestId, resourceLabel });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not submit your emergency request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (createdRequest) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="card text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Request Created Successfully</p>
          <h1 className="mt-4 text-3xl font-semibold">Request ID: {createdRequest.requestId}</h1>
          <p className="mt-3 text-ink/60">Estimated Delivery: 10 Minutes</p>

          <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
            {STATUS_FLOW.map((label, idx) => (
              <div key={label} className={`rounded-2xl border px-3 py-4 ${idx === 0 ? 'border-rose-200 bg-rose-50' : 'border-black/5 bg-mist'}`}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-ink">{label}</span>
                </div>
                <p className="text-xs text-ink/50">{idx === 0 ? 'Request received' : idx === 1 ? 'Hospital approval' : idx === 2 ? 'Resource prepared' : idx === 3 ? 'Pickup/route assignment' : 'Delivered to patient'}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate(`/track/${createdRequest.requestId}`)} className="btn-primary">
              TRACK REQUEST
            </button>
            <button onClick={() => navigate(isBlood ? '/blood' : '/oxygen')} className="btn-secondary">
              Back to {resourceLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Emergency {resourceLabel} Request</p>
          <h1 className="mt-2 text-3xl font-semibold">{resourceLabel} delivery in 10 minutes</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
          <Clock3 size={16} /> Estimated Delivery: 10 Minutes
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label">Patient Name</label>
            <input className="input" value={form.patientName} onChange={updateField('patientName')} required placeholder="Enter patient name" />
          </div>

          <div>
            <label className="label">Mobile Number</label>
            <input className="input" value={form.mobileNumber} onChange={updateField('mobileNumber')} required placeholder="Enter mobile number" />
          </div>

          {isBlood ? (
            <>
              <div>
                <label className="label">Blood Group</label>
                <select className="input" value={form.bloodGroup} onChange={updateField('bloodGroup')}>
                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Quantity</label>
                <input type="number" min={1} className="input" value={form.quantity} onChange={updateField('quantity')} required />
              </div>
            </>
          ) : (
            <div>
              <label className="label">Oxygen / Cylinder Type</label>
              <input className="input" value="Oxygen Cylinder" readOnly />
              <div className="mt-4">
                <label className="label">Quantity</label>
                <input type="number" min={1} className="input" value={form.quantity} onChange={updateField('quantity')} required />
              </div>
            </div>
          )}

          <div>
            <label className="label">Delivery Address</label>
            <textarea className="input" rows={3} value={form.deliveryAddress} onChange={updateField('deliveryAddress')} required placeholder="Enter full delivery address" />
          </div>

          <div>
            <label className="label">Emergency level</label>
            <div className="flex flex-wrap gap-2">
              {['Urgent', 'Critical'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, urgency: level }))}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${form.urgency === level ? 'bg-rose-500 text-white' : 'bg-mist text-ink/60'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-critical">{error}</div>}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Submitting emergency request...' : `Submit ${resourceLabel} Request`}
          </button>
        </form>

        <div className="space-y-4">
          <div className="card">
            <div className="mb-4 flex items-center gap-3">
              {isBlood ? <Droplet className="text-rose-500" /> : <Wind className="text-rose-500" />}
              <h2 className="text-xl font-semibold">Request journey</h2>
            </div>
            <div className="space-y-3 text-sm text-ink/70">
              <div className="flex items-center gap-3"><ShieldCheck className="text-rose-500" size={16} />User request</div>
              <div className="flex items-center gap-3"><ShieldCheck className="text-rose-500" size={16} />Hospital / blood bank approval</div>
              <div className="flex items-center gap-3"><ShieldCheck className="text-rose-500" size={16} />Resource preparation</div>
              <div className="flex items-center gap-3"><MapPinned className="text-rose-500" size={16} />Authorized pickup</div>
              <div className="flex items-center gap-3"><Clock3 className="text-rose-500" size={16} />Delivery partner dispatch</div>
            </div>
          </div>

          <div className="card bg-mist">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Prototype notice</p>
            <p className="mt-2 text-sm text-ink/70">
              This demo simulates the emergency logistics workflow and tracking process for hospital approval and delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
