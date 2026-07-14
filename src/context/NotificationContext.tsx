import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { notificationApi } from "../api/notificationApi";
import { mockNotifications } from "../data/userMock";
import { providerNotifications } from "../data/providerMock";
import type { AppNotification } from "../data/userMock";

type NotificationCtx = {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  removeNotification: (id: number) => Promise<void>;
};

const Ctx = createContext<NotificationCtx | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fallback = useCallback(
    (): AppNotification[] => (user?.role === "PROVIDER" ? providerNotifications : mockNotifications),
    [user?.role]
  );


  
  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const data = await notificationApi.list(user.id);

            const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setNotifications(sorted);
    } catch (error) {
      console.error(error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, fallback]);

  useEffect(() => { refreshNotifications(); }, [refreshNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    setNotifications((arr) => arr.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try { await notificationApi.markRead(id); } catch {}
  }, []);

  const removeNotification = useCallback(async (id: number) => {
    setNotifications((arr) => arr.filter((n) => n.id !== id));
    try { await notificationApi.remove(id); } catch {}
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  return (
    <Ctx.Provider value={{ notifications, unreadCount, loading, refreshNotifications, markAsRead, removeNotification }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
