import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { requestService } from '../../services/requestService';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    try {
      const { data } = await requestService.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Silently ignore - notifications are supplementary, not critical path.
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unreadCount > 0) {
      await requestService.markAllNotificationsRead();
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative rounded-full p-2 hover:bg-mist" aria-label="Notifications">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-critical text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 max-h-96 overflow-y-auto rounded-2xl border border-black/5 bg-white p-2 shadow-soft">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-ink/50">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="rounded-xl p-3 hover:bg-mist">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="text-xs text-ink/60">{n.message}</p>
                <p className="mt-1 text-[11px] text-ink/40">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
