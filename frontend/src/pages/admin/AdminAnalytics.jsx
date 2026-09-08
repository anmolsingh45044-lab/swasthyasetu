import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import useFetch from '../../hooks/useFetch';
import { analyticsService } from '../../services/deliveryService';
import ChartCard from '../../components/analytics/ChartCard';
import { LoadingState, ErrorState } from '../../components/common/States';

const COLORS = ['#E23B5B', '#FF8FA0', '#FFC2CC', '#C22849', '#9E1E3B', '#F76C82'];

export default function AdminAnalytics() {
  const bloodByGroup = useFetch(() => analyticsService.getBloodByGroup(), []);
  const requestsOverTime = useFetch(() => analyticsService.getRequestsOverTime(), []);
  const requestStatus = useFetch(() => analyticsService.getRequestStatus(), []);
  const bedAvailability = useFetch(() => analyticsService.getBedAvailability(), []);
  const facilityDistribution = useFetch(() => analyticsService.getFacilityDistribution(), []);

  const loading =
    bloodByGroup.loading || requestsOverTime.loading || requestStatus.loading || bedAvailability.loading || facilityDistribution.loading;
  const error = bloodByGroup.error || requestsOverTime.error || requestStatus.error || bedAvailability.error || facilityDistribution.error;

  if (loading) return <LoadingState label="Crunching the numbers..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="mt-1 text-ink/60">System-wide trends across blood, beds, oxygen and requests.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Blood Inventory by Group" subtitle="Units currently available" isEmpty={!bloodByGroup.data?.inventory?.length}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bloodByGroup.data?.inventory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E5E7" />
              <XAxis dataKey="_id" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="units" fill="#E23B5B" radius={[6, 6, 0, 0]} name="Units" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Blood Requests by Group" subtitle="Total requests received" isEmpty={!bloodByGroup.data?.requests?.length}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bloodByGroup.data?.requests}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E5E7" />
              <XAxis dataKey="_id" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="requests" fill="#C22849" radius={[6, 6, 0, 0]} name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Requests Over Time" subtitle="Daily blood request volume" isEmpty={!requestsOverTime.data?.data?.length}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={requestsOverTime.data?.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E5E7" />
              <XAxis dataKey="_id" fontSize={11} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#E23B5B" strokeWidth={2.5} name="Requests" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Request Status Breakdown" isEmpty={!requestStatus.data?.data?.length}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={requestStatus.data?.data} dataKey="count" nameKey="_id" outerRadius={90} label>
                {(requestStatus.data?.data || []).map((entry, idx) => (
                  <Cell key={entry._id} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Bed Availability by Type" isEmpty={!bedAvailability.data?.data?.length}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bedAvailability.data?.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E5E7" />
              <XAxis dataKey="_id" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="available" fill="#E23B5B" radius={[6, 6, 0, 0]} name="Available" />
              <Bar dataKey="total" fill="#FFC2CC" radius={[6, 6, 0, 0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Facility Distribution" isEmpty={!facilityDistribution.data?.data?.length}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={facilityDistribution.data?.data} dataKey="count" nameKey="_id" outerRadius={90} label>
                {(facilityDistribution.data?.data || []).map((entry, idx) => (
                  <Cell key={entry._id} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
