import React from 'react';
import { Loader2, Inbox, ShieldAlert, WifiOff } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink/50">
      <Loader2 className="animate-spin" size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-black/10 bg-mist/50 py-16 text-center">
      <Icon size={28} className="text-ink/30" />
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink/50">{description}</p>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 py-16 text-center">
      <WifiOff size={28} className="text-critical" />
      <p className="max-w-sm text-sm text-critical">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary !py-2 text-xs">
          Try again
        </button>
      )}
    </div>
  );
}

export function UnauthorizedState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white py-16 text-center">
      <ShieldAlert size={28} className="text-ink/30" />
      <p className="font-medium text-ink">You don't have permission to access this page.</p>
    </div>
  );
}
