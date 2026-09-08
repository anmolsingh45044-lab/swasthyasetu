import React, { useState } from 'react';
import { Droplet, Plus, Trash2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { bloodService } from '../../services/bloodService';
import { facilityService } from '../../services/facilityService';
import Modal from '../../components/common/Modal';
import { BLOOD_GROUPS } from '../../constants';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';

export default function AdminBlood() {
  const { data, loading, error, refetch } = useFetch(() => bloodService.getInventory({}), []);
  const facilities = useFetch(() => facilityService.getFacilities({}), []);
  const inventory = data?.inventory || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ facility: '', bloodGroup: 'O+', units: 0 });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bloodService.upsertInventory({ ...form, units: Number(form.units) });
      setModalOpen(false);
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this inventory record?')) return;
    await bloodService.deleteInventory(id);
    refetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blood Inventory</h1>
          <p className="mt-1 text-ink/60">Add or update blood unit availability by facility.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Add / Update
        </button>
      </div>

      <div className="mt-6">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && inventory.length === 0 && <EmptyState title="No blood inventory recorded yet" icon={Droplet} />}
        {!loading && !error && inventory.length > 0 && (
          <div className="card overflow-x-auto !p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3">Facility</th>
                  <th className="px-5 py-3">Group</th>
                  <th className="px-5 py-3">Units</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((i) => (
                  <tr key={i._id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3 font-medium">{i.facility?.name}</td>
                    <td className="px-5 py-3">{i.bloodGroup}</td>
                    <td className="px-5 py-3">{i.units}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDelete(i._id)} className="text-critical hover:underline">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add / Update Blood Inventory">
        <form onSubmit={handleSubmit} className="space-y-3">
          <select required className="input" value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })}>
            <option value="">Select facility</option>
            {(facilities.data?.facilities || []).map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
          <select className="input" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          <input type="number" min={0} className="input" value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
