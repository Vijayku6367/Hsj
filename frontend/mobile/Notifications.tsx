import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'achievement';
  title: string;
  message: string;
  timestamp: number;
}

interface NotificationsProps {
  notifications: Notification[];
}

export default function Notifications({ notifications }: NotificationsProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '🚨';
      case 'success': return '✅';
      case 'achievement': return '🏆';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info': return '#2196F3';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      case 'success': return '#4CAF50';
      case 'achievement': return '#FFD700';
      default: return '#9C27B0';
    }
  };

  return (
    <div className="notifications-container">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification) => (
          <motion.div
            key={notification.id}
            className="notification"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{ borderLeft: `4px solid ${getNotificationColor(notification.type)}` }}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <style jsx>{`
        .notifications-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 300px;
        }
        
        .notification {
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .notification-icon {
          font-size: 16px;
          margin-top: 2px;
        }
        
        .notification-content {
          flex: 1;
          color: white;
        }
        
        .notification-title {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .notification-message {
          font-size: 12px;
          opacity: 0.9;
          line-height: 1.3;
        }
        
        @media (max-width: 768px) {
          .notifications-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}
