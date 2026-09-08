import React from 'react';
import { Clock, CheckCircle2, XCircle, Truck, PackageCheck, AlertTriangle } from 'lucide-react';

const CONFIG = {
  Pending: { icon: Clock, classes: 'bg-mist text-ink/70' },
  PENDING: { icon: Clock, classes: 'bg-mist text-ink/70' },
  Approved: { icon: CheckCircle2, classes: 'bg-rose-100 text-rose-700' },
  APPROVED: { icon: CheckCircle2, classes: 'bg-rose-100 text-rose-700' },
  READY_FOR_PICKUP: { icon: PackageCheck, classes: 'bg-rose-100 text-rose-700' },
  PICKED_UP: { icon: PackageCheck, classes: 'bg-rose-100 text-rose-700' },
  OUT_FOR_DELIVERY: { icon: Truck, classes: 'bg-rose-100 text-rose-700' },
  DELIVERED: { icon: PackageCheck, classes: 'bg-green-50 text-green-700' },
  Rejected: { icon: XCircle, classes: 'bg-rose-50 text-critical' },
  REJECTED: { icon: XCircle, classes: 'bg-rose-50 text-critical' },
  Fulfilled: { icon: PackageCheck, classes: 'bg-green-50 text-green-700' },
  Cancelled: { icon: XCircle, classes: 'bg-mist text-ink/50' },
  Assigned: { icon: CheckCircle2, classes: 'bg-rose-100 text-rose-700' },
  ASSIGNED: { icon: CheckCircle2, classes: 'bg-rose-100 text-rose-700' },
  'Picked Up': { icon: PackageCheck, classes: 'bg-rose-100 text-rose-700' },
  'In Transit': { icon: Truck, classes: 'bg-rose-100 text-rose-700' },
  Delivered: { icon: PackageCheck, classes: 'bg-green-50 text-green-700' },
  Normal: { icon: Clock, classes: 'bg-mist text-ink/70' },
  Urgent: { icon: AlertTriangle, classes: 'bg-amber-50 text-amber-700' },
  Critical: { icon: AlertTriangle, classes: 'bg-red-50 text-critical' },
  Available: { icon: CheckCircle2, classes: 'bg-green-50 text-green-700' },
  Low: { icon: AlertTriangle, classes: 'bg-amber-50 text-amber-700' },
  'Out of Stock': { icon: XCircle, classes: 'bg-red-50 text-critical' },
  Scheduled: { icon: Clock, classes: 'bg-rose-100 text-rose-700' },
  Completed: { icon: PackageCheck, classes: 'bg-green-50 text-green-700' }
};

export default function StatusBadge({ status }) {
  const label = status || 'Pending';
  const config = CONFIG[label] || { icon: Clock, classes: 'bg-mist text-ink/70' };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}>
      <Icon size={13} strokeWidth={2.5} />
      {label}
    </span>
  );
}
