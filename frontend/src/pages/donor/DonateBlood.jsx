import React, { useState } from 'react';
import { Droplet } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { facilityService } from '../../services/facilityService';
import { requestService } from '../../services/requestService';
import { BLOOD_GROUPS } from '../../constants';
import { LoadingState, EmptyState } from '../../components/common/States';
import { useAuth } from '../../context/AuthContext';

export default function DonateBlood() {
  const { user } = useAuth();
  const facilities = useFetch(() => facilityService.getFacilities({}), []);
  const [form, setForm] = useState({ facility: '', bloodGroup: user?.bloodGroup || BLOOD_GROUPS[0], donationDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await requestService.createDonation(form);
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="text-2xl font-semibold">Donate Blood</h1>
      <p className="mt-1 text-ink/60">List your availability and schedule a donation at a nearby facility.</p>

      {success ? (
        <div className="card mt-6 text-center">
          <Droplet className="mx-auto mb-2 text-rose-500" size={28} />
          <p className="font-semibold">Donation scheduled — thank you!</p>
          <p className="mt-1 text-sm text-ink/60">You'll get a notification with the confirmed details.</p>
          <button onClick={() => setSuccess(false)} className="btn-secondary mt-4">
            Schedule another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
          <div>
            <label className="label">Blood group</label>
            <select className="input" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Facility</label>
            {facilities.loading ? (
              <LoadingState label="Loading facilities..." />
            ) : (
              <select
                required
                className="input"
                value={form.facility}
                onChange={(e) => setForm({ ...form, facility: e.target.value })}
              >
                <option value="">Select a facility</option>
                {(facilities.data?.facilities || []).map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} — {f.city}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="label">Preferred date</label>
            <input
              type="date"
              className="input"
              value={form.donationDate}
              onChange={(e) => setForm({ ...form, donationDate: e.target.value })}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Scheduling...' : 'Schedule Donation'}
          </button>
        </form>
      )}
    </div>
  );
}
