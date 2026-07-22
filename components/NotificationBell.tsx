"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markNotificationAsRead } from "@/app/actions/notifications";
import clsx from "clsx";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNotifications() {
      const data = await getNotifications();
      setNotifications(data);
    }
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markNotificationAsRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-strawberry text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-md border border-white/10 bg-cocoa shadow-xl lg:left-0 lg:right-auto">
          <div className="border-b border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
            Notifications ({unreadCount})
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-white/50">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={clsx(
                    "border-b border-white/5 px-4 py-3 text-sm transition-colors",
                    notif.read ? "bg-transparent opacity-60" : "bg-white/5"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={clsx("font-semibold", notif.type === 'LOW_STOCK' ? 'text-amber-400' : notif.type === 'EXPIRY' ? 'text-strawberry' : 'text-vanilla')}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <button 
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="text-xs text-white/50 hover:text-white"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="text-white/80 text-xs">
                    {notif.message}
                  </div>
                  <div className="mt-2 text-[10px] text-white/40">
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
