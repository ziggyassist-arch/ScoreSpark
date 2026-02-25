"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface NotificationPreferences {
  enabled: boolean;
  matchStart: boolean;
  goals: boolean;
  finalScore: boolean;
  redCards: boolean;
  followedTeamsOnly: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  enabled: false,
  matchStart: true,
  goals: true,
  finalScore: true,
  redCards: false,
  followedTeamsOnly: true,
};

const STORAGE_KEY = "scorespark-notifications";

interface NotificationContextValue {
  prefs: NotificationPreferences;
  updatePrefs: (update: Partial<NotificationPreferences>) => void;
  permissionStatus: NotificationPermission | "unsupported";
  requestPermission: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | "unsupported">("default");

  // Load preferences + check browser support
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) });
      }
    } catch {}

    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus("unsupported");
    }
  }, []);

  const updatePrefs = useCallback((update: Partial<NotificationPreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...update };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;

    if (Notification.permission === "granted") {
      setPermissionStatus("granted");
      updatePrefs({ enabled: true });
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      setPermissionStatus(result);
      if (result === "granted") {
        updatePrefs({ enabled: true });
        return true;
      }
    } catch {}
    return false;
  }, [updatePrefs]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!prefs.enabled || permissionStatus !== "granted") return;
      if (typeof window === "undefined" || !("Notification" in window)) return;

      try {
        new Notification(title, {
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          ...options,
        });
      } catch {
        // Notification constructor may fail in some contexts
      }
    },
    [prefs.enabled, permissionStatus]
  );

  return (
    <NotificationContext.Provider
      value={{ prefs, updatePrefs, permissionStatus, requestPermission, sendNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
