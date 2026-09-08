import React, { useState } from 'react';
import { BedDouble, Plus, Trash2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { bedService } from '../../services/bedService';
import { facilityService } from '../../services/facilityService';
import Modal from '../../components/common/Modal';
import { BED_TYPES } from '../../constants';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';

export default function AdminBeds() {
  const { data, loading, error, refetch } = useFetch(() => bedService.getBeds({}), []);
  const facilities = useFetch(() => facilityService.getFacilities({}), []);
  const beds = data?.beds || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ facility: '', bedType: 'General', totalBeds: 10, availableBeds: 5 });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bedService.upsertBed({
        ...form,
        totalBeds: Number(form.totalBeds),
        availableBeds: Number(form.availableBeds)
      });
      setModalOpen(false);
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this bed record?')) return;
    await bedService.deleteBed(id);
    refetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Beds</h1>
          <p className="mt-1 text-ink/60">Manage bed availability by category and facility.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Add / Update
        </button>
      </div>

      <div className="mt-6">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && beds.length === 0 && <EmptyState title="No bed records yet" icon={BedDouble} />}
        {!loading && !error && beds.length > 0 && (
          <div className="card overflow-x-auto !p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3">Facility</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Available / Total</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {beds.map((b) => (
                  <tr key={b._id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3 font-medium">{b.facility?.name}</td>
                    <td className="px-5 py-3">{b.bedType}</td>
                    <td className="px-5 py-3">
                      {b.availableBeds} / {b.totalBeds}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDelete(b._id)} className="text-critical hover:underline">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add / Update Bed Availability">
        <form onSubmit={handleSubmit} className="space-y-3">
          <select required className="input" value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })}>
            <option value="">Select facility</option>
            {(facilities.data?.facilities || []).map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
          <select className="input" value={form.bedType} onChange={(e) => setForm({ ...form, bedType: e.target.value })}>
            {BED_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Total beds</label>
              <input type="number" min={0} className="input" value={form.totalBeds} onChange={(e) => setForm({ ...form, totalBeds: e.target.value })} />
            </div>
            <div>
              <label className="label">Available</label>
              <input type="number" min={0} className="input" value={form.availableBeds} onChange={(e) => setForm({ ...form, availableBeds: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
