import React from 'react';
import { Heart } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { requestService } from '../../services/requestService';
import { LoadingState, EmptyState, ErrorState } from '../../components/common/States';
import StatusBadge from '../../components/common/StatusBadge';

export default function MyDonations() {
  const { data, loading, error } = useFetch(() => requestService.getDonations(), []);
  const donations = data?.donations || [];

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="text-2xl font-semibold">My Donations</h1>
      <p className="mt-1 text-ink/60">Your donation history and upcoming scheduled donations.</p>

      <div className="mt-6">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!loading && !error && donations.length === 0 && (
          <EmptyState title="No donations yet" description="Schedule your first donation to see it here." icon={Heart} />
        )}
        {!loading && !error && donations.length > 0 && (
          <div className="space-y-3">
            {donations.map((d) => (
              <div key={d._id} className="card flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink">
                    {d.bloodGroup} · {d.units} unit(s)
                  </p>
                  <p className="text-sm text-ink/60">{d.facility?.name}</p>
                  <p className="text-xs text-ink/40">{new Date(d.donationDate || d.createdAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
