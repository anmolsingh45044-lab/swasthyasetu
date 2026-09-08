import React, { useState } from 'react';
import { Building2, Plus, Trash2, Pencil } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { facilityService } from '../../services/facilityService';
import Modal from '../../components/common/Modal';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';

const emptyForm = {
  name: '',
  type: 'Government Hospital',
  city: '',
  state: '',
  address: '',
  phone: '',
  lat: '',
  lng: ''
};

export default function AdminFacilities() {
  const { data, loading, error, refetch } = useFetch(() => facilityService.getFacilities({}), []);
  const facilities = data?.facilities || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (f) => {
    setEditingId(f._id);
    setForm({
      name: f.name,
      type: f.type,
      city: f.city,
      state: f.state || '',
      address: f.address,
      phone: f.phone || '',
      lat: f.location.lat,
      lng: f.location.lng
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      name: form.name,
      type: form.type,
      city: form.city,
      state: form.state,
      address: form.address,
      phone: form.phone,
      location: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) }
    };
    try {
      if (editingId) {
        await facilityService.updateFacility(editingId, payload);
      } else {
        await facilityService.createFacility(payload);
      }
      setModalOpen(false);
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this facility? This cannot be undone.')) return;
    await facilityService.deleteFacility(id);
    refetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Facilities</h1>
          <p className="mt-1 text-ink/60">Add, edit or remove facility information.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Facility
        </button>
      </div>

      <div className="mt-6">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && facilities.length === 0 && <EmptyState title="No facilities yet" icon={Building2} />}
        {!loading && !error && facilities.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f) => (
              <div key={f._id} className="card">
                <p className="text-xs font-semibold uppercase text-rose-500">{f.type}</p>
                <h3 className="mt-1 font-semibold">{f.name}</h3>
                <p className="text-sm text-ink/60">{f.city}</p>
                <div className="mt-4 flex gap-2 border-t border-black/5 pt-3">
                  <button onClick={() => openEdit(f)} className="btn-secondary flex-1 !py-1.5 text-xs">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(f._id)} className="btn-secondary flex-1 !py-1.5 text-xs !text-critical">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Facility' : 'Add Facility'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Facility name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {['Government Hospital', 'Private Hospital', 'Primary Health Centre', 'Blood Bank', 'Community Health Centre'].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input required placeholder="Address" className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="City" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="State" className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <input placeholder="Phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" step="any" placeholder="Latitude" className="input" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            <input required type="number" step="any" placeholder="Longitude" className="input" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Saving...' : editingId ? 'Save changes' : 'Add facility'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
