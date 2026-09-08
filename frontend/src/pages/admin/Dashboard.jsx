import React from 'react';
import { Users, Droplet, ClipboardList, BedDouble, Wind, Truck, HeartHandshake } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { analyticsService } from '../../services/deliveryService';
import StatCard from '../../components/common/StatCard';
import { LoadingState, ErrorState } from '../../components/common/States';

export default function AdminDashboard() {
  const { data, loading, error } = useFetch(() => analyticsService.getSummary(), []);
  const s = data?.summary;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-1 text-ink/60">System-wide overview of Swasthya Setu.</p>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!loading && !error && s && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total users" icon={Users} value={s.totalUsers} />
          <StatCard label="Active donors" icon={HeartHandshake} value={s.activeDonors} />
          <StatCard label="Blood units available" icon={Droplet} value={s.bloodUnitsAvailable} tone="brand" />
          <StatCard label="Blood requests" icon={ClipboardList} value={s.bloodRequests} />
          <StatCard label="Available beds" icon={BedDouble} value={s.bedsAvailable} />
          <StatCard label="Oxygen cylinders" icon={Wind} value={s.oxygenCylinders} />
          <StatCard label="Pending deliveries" icon={Truck} value={s.pendingDeliveries} tone="critical" />
        </div>
      )}
    </div>
  );
}
