import React, { useState } from 'react';
import { Wind, Plus, Trash2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { oxygenService } from '../../services/oxygenService';
import { facilityService } from '../../services/facilityService';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';

export default function AdminOxygen() {
  const { data, loading, error, refetch } = useFetch(() => oxygenService.getOxygen({}), []);
  const facilities = useFetch(() => facilityService.getFacilities({}), []);
  const oxygen = data?.oxygen || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ facility: '', cylinderType: 'D-Type', availableCylinders: 10, capacity: '10L' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await oxygenService.upsertOxygen({ ...form, availableCylinders: Number(form.availableCylinders) });
      setModalOpen(false);
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this oxygen record?')) return;
    await oxygenService.deleteOxygen(id);
    refetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Oxygen</h1>
          <p className="mt-1 text-ink/60">Manage oxygen cylinder inventory across facilities.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Add / Update
        </button>
      </div>

      <div className="mt-6">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && oxygen.length === 0 && <EmptyState title="No oxygen records yet" icon={Wind} />}
        {!loading && !error && oxygen.length > 0 && (
          <div className="card overflow-x-auto !p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3">Facility</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Available</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {oxygen.map((o) => (
                  <tr key={o._id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3 font-medium">{o.facility?.name}</td>
                    <td className="px-5 py-3">{o.cylinderType}</td>
                    <td className="px-5 py-3">{o.availableCylinders}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDelete(o._id)} className="text-critical hover:underline">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add / Update Oxygen Inventory">
        <form onSubmit={handleSubmit} className="space-y-3">
          <select required className="input" value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })}>
            <option value="">Select facility</option>
            {(facilities.data?.facilities || []).map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
          <select className="input" value={form.cylinderType} onChange={(e) => setForm({ ...form, cylinderType: e.target.value })}>
            {['B-Type', 'D-Type', 'Jumbo', 'Liquid Oxygen'].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input type="number" min={0} placeholder="Available cylinders" className="input" value={form.availableCylinders} onChange={(e) => setForm({ ...form, availableCylinders: e.target.value })} />
          <input placeholder="Capacity (e.g. 10L)" className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
