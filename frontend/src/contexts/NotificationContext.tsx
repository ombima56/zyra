"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import Notification, {
  NotificationData,
  NotificationType,
} from "@/components/ui/Notification";

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    message: string,
    duration?: number
  ) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = (
    type: NotificationType,
    message: string,
    duration = 3000
  ) => {
    const id = new Date().toISOString();
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
  };

  const showSuccess = (message: string, duration?: number) => {
    showNotification("success", message, duration);
  };

  const showError = (message: string, duration?: number) => {
    showNotification("error", message, duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showNotification("warning", message, duration);
  };

  const showInfo = (message: string, duration?: number) => {
    showNotification("info", message, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
