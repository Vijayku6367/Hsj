import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'command' | 'system' | 'achievement';
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Mock data - in real app this comes from WebSocket
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        user: 'You',
        action: 'Connected to simulator',
        timestamp: new Date().toISOString(),
        type: 'system'
      },
      {
        id: '2', 
        user: 'Alex',
        action: 'Moved robot forward',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        type: 'command'
      },
      {
        id: '3',
        user: 'System',
        action: '🎯 Achievement Unlocked: First Move!',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        type: 'achievement'
      }
    ];
    setActivities(mockActivities);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'command': return '⚡';
      case 'system': return '🔧';
      case 'achievement': return '🏆';
      default: return '📝';
    }
  };

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h3>📋 Activity Feed</h3>
        <span className="badge">{activities.length}</span>
      </div>
      
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className={`activity-item ${activity.type}`}>
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <div className="activity-text">
                <span className="user">{activity.user}</span>
                {activity.action}
              </div>
              <div className="activity-time">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .activity-feed {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 15px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          color: white;
        }
        
        .feed-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .badge {
          background: #ff4444;
          color: white;
          border-radius: 10px;
          padding: 2px 8px;
          font-size: 12px;
        }
        
        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          transition: background 0.2s;
        }
        
        .activity-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .activity-item.achievement {
          background: rgba(255, 215, 0, 0.1);
        }
        
        .activity-icon {
          font-size: 14px;
          margin-top: 2px;
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-text {
          color: white;
          font-size: 13px;
          line-height: 1.3;
        }
        
        .user {
          font-weight: bold;
          margin-right: 5px;
        }
        
        .activity-time {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 2px;
        }
        
        /* Scrollbar styling */
        .activity-feed::-webkit-scrollbar {
          width: 4px;
        }
        
        .activity-feed::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        .activity-feed::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
