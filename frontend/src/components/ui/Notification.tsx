import { useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationData {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationProps {
  notification: NotificationData;
  onClose: (id: string) => void;
}

const Notification = ({ notification, onClose }: NotificationProps) => {
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  const colorMap = {
    success: {
      bg: "bg-green-700/30 border-green-700",
      icon: <CheckCircle className="text-green-400" />,
      text: "text-green-300",
      closeBtn: "text-green-400 hover:text-green-300",
    },
    error: {
      bg: "bg-red-700/30 border-red-700",
      icon: <AlertTriangle className="text-red-400" />,
      text: "text-red-300",
      closeBtn: "text-red-400 hover:text-red-300",
    },
    warning: {
      bg: "bg-yellow-700/30 border-yellow-700",
      icon: <AlertTriangle className="text-yellow-400" />,
      text: "text-yellow-300",
      closeBtn: "text-yellow-400 hover:text-yellow-300",
    },
    info: {
      bg: "bg-blue-700/30 border-blue-700",
      icon: <Info className="text-blue-400" />,
      text: "text-blue-300",
      closeBtn: "text-blue-400 hover:text-blue-300",
    },
  };

  const { bg, icon, text, closeBtn } = colorMap[notification.type];

  return (
    <div
      className={`relative rounded-md border-l-4 p-4 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01] ${bg}`}
      role="alert"
    >
      <div className="flex items-center space-x-4">
        {icon}
        <div className={`text-sm font-medium ${text}`}>
          {notification.message}
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className={`ml-auto rounded-md p-1 opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-opacity ${closeBtn}`}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
