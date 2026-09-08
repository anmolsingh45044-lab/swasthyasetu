import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, BedDouble, Wind, ClipboardList, Plus } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { bloodService } from '../../services/bloodService';
import { requestService } from '../../services/requestService';
import { facilityService } from '../../services/facilityService';
import StatCard from '../../components/common/StatCard';
import RequestCard from '../../components/common/RequestCard';
import FacilityCard from '../../components/common/FacilityCard';
import { LoadingState, EmptyState } from '../../components/common/States';
import NewRequestModal from '../../components/dashboard/NewRequestModal';
import { useAuth } from '../../context/AuthContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const bloodRequests = useFetch(() => bloodService.getRequests({ mine: 'true' }), []);
  const resourceRequests = useFetch(() => requestService.getResourceRequests({ mine: 'true' }), []);
  const facilities = useFetch(() => facilityService.getFacilities({}), []);

  const allRequests = [...(bloodRequests.data?.requests || []), ...(resourceRequests.data?.requests || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const activeCount = allRequests.filter((r) => ['Pending', 'Accepted'].includes(r.status)).length;

  const bloodAvailable = (facilities.data?.facilities || []).reduce((sum, f) => sum + (f.availability?.blood || 0), 0);
  const bedsAvailable = (facilities.data?.facilities || []).reduce((sum, f) => sum + (f.availability?.beds || 0), 0);
  const oxygenAvailable = (facilities.data?.facilities || []).reduce((sum, f) => sum + (f.availability?.oxygen || 0), 0);

  const refetchAll = () => {
    bloodRequests.refetch();
    resourceRequests.refetch();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="text-ink/60">Here's what's happening around you right now.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> New Request
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Blood available nearby" icon={Droplet} value={bloodAvailable} />
        <StatCard label="Beds available nearby" icon={BedDouble} value={bedsAvailable} />
        <StatCard label="Oxygen available nearby" icon={Wind} value={oxygenAvailable} />
        <StatCard label="My active requests" icon={ClipboardList} value={activeCount} tone="brand" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link to="/blood" className="btn-secondary justify-center">
          Find Blood
        </Link>
        <Link to="/beds" className="btn-secondary justify-center">
          Find Beds
        </Link>
        <Link to="/oxygen" className="btn-secondary justify-center">
          Find Oxygen
        </Link>
        <Link to="/facilities" className="btn-secondary justify-center">
          Find Hospital
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent requests</h2>
            <Link to="/patient/requests" className="text-sm font-medium text-rose-600">
              View all
            </Link>
          </div>
          {bloodRequests.loading || resourceRequests.loading ? (
            <LoadingState />
          ) : allRequests.length === 0 ? (
            <EmptyState title="No requests yet" description="Requests you make for blood, beds or oxygen will show up here." icon={ClipboardList} />
          ) : (
            <div className="space-y-3">
              {allRequests.slice(0, 3).map((r) => (
                <RequestCard key={r._id} request={r} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Nearby facilities</h2>
          {facilities.loading ? (
            <LoadingState />
          ) : (
            <div className="space-y-3">
              {(facilities.data?.facilities || []).slice(0, 2).map((f) => (
                <FacilityCard key={f._id} facility={f} />
              ))}
            </div>
          )}
        </section>
      </div>

      <NewRequestModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={refetchAll} />
    </div>
  );
}
