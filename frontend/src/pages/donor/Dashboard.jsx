import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, ClipboardList, CheckCircle2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { bloodService } from '../../services/bloodService';
import { requestService } from '../../services/requestService';
import StatCard from '../../components/common/StatCard';
import RequestCard from '../../components/common/RequestCard';
import { LoadingState, EmptyState } from '../../components/common/States';
import { useAuth } from '../../context/AuthContext';

export default function DonorDashboard() {
  const { user } = useAuth();
  const pendingRequests = useFetch(() => bloodService.getRequests({ status: 'Pending' }), []);
  const myDonations = useFetch(() => requestService.getDonations(), []);
  const acceptedByMe = useFetch(() => bloodService.getRequests({ status: 'Accepted' }), []);

  const matchingRequests = (pendingRequests.data?.requests || []).filter(
    (r) => !user?.bloodGroup || r.bloodGroup === user.bloodGroup
  );

  const handleAccept = async (id) => {
    await bloodService.acceptRequest(id);
    pendingRequests.refetch();
    acceptedByMe.refetch();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="text-ink/60">Thank you for being a donor. Here's what needs your help.</p>
        </div>
        <Link to="/donor/donate" className="btn-primary">
          <Droplet size={16} /> Donate Blood
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My blood group" icon={Droplet} value={user?.bloodGroup || '—'} />
        <StatCard label="My donations" icon={Heart} value={user?.donorProfile?.totalDonations || 0} tone="brand" />
        <StatCard
          label="Pending requests"
          icon={ClipboardList}
          value={pendingRequests.data?.requests?.length || 0}
        />
        <StatCard
          label="Accepted by me"
          icon={CheckCircle2}
          value={(acceptedByMe.data?.requests || []).filter((r) => r.acceptedBy?._id === user?._id).length}
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Requests matching your blood group</h2>
        {pendingRequests.loading ? (
          <LoadingState />
        ) : matchingRequests.length === 0 ? (
          <EmptyState title="No matching requests right now" description="We'll notify you when a new request matches your blood group." icon={Droplet} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {matchingRequests.map((r) => (
              <RequestCard
                key={r._id}
                request={r}
                primaryAction={
                  <button onClick={() => handleAccept(r._id)} className="btn-primary !py-1.5 text-xs">
                    Accept Request
                  </button>
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
