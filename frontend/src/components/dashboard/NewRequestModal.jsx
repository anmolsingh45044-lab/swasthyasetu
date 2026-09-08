import React, { useState } from 'react';
import Modal from '../common/Modal';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../../constants';
import { bloodService } from '../../services/bloodService';
import { requestService } from '../../services/requestService';

export default function NewRequestModal({ open, onClose, onCreated }) {
  const [kind, setKind] = useState('Blood');
  const [form, setForm] = useState({ bloodGroup: 'O+', units: 1, resourceType: 'Bed', details: '', urgency: 'Normal' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (kind === 'Blood') {
        await bloodService.createRequest({ bloodGroup: form.bloodGroup, units: Number(form.units), urgency: form.urgency });
      } else {
        await requestService.createResourceRequest({
          resourceType: form.resourceType,
          details: form.details,
          urgency: form.urgency,
          quantity: 1
        });
      }
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Request">
      <div className="mb-4 flex gap-2">
        {['Blood', 'Bed', 'Oxygen', 'Diagnostics', 'Medicine'].map((k) => (
          <button
            key={k}
            onClick={() => {
              if (k === 'Blood') {
                setKind('Blood');
              } else {
                setKind('Resource');
                setForm((prev) => ({ ...prev, resourceType: k }));
              }
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              (k === 'Blood' ? kind === 'Blood' : kind === 'Resource' && form.resourceType === k)
                ? 'bg-rose-500 text-white'
                : 'bg-mist text-ink/60'
            }`}
            type="button"
          >
            {k}
          </button>
        ))}
      </div>

      {error && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-critical">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {kind === 'Blood' ? (
          <>
            <div>
              <label className="label">Blood group</label>
              <select className="input" value={form.bloodGroup} onChange={update('bloodGroup')}>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Units needed</label>
              <input type="number" min={1} className="input" value={form.units} onChange={update('units')} />
            </div>
          </>
        ) : (
          <div>
            <label className="label">Details</label>
            <textarea
              className="input"
              rows={3}
              placeholder={`Describe what you need for ${form.resourceType.toLowerCase()}...`}
              value={form.details}
              onChange={update('details')}
            />
          </div>
        )}

        <div>
          <label className="label">Urgency</label>
          <div className="flex gap-2">
            {URGENCY_LEVELS.map((u) => (
              <button
                type="button"
                key={u}
                onClick={() => setForm({ ...form, urgency: u })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  form.urgency === u ? 'bg-rose-500 text-white' : 'bg-mist text-ink/60'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </Modal>
  );
}
