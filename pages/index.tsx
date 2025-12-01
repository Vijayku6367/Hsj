import { useState, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import TouchControls from '../components/mobile/TouchControls';
import MobileGrid from '../components/mobile/MobileGrid';
import SensorCards from '../components/mobile/SensorCards';
import ActivityFeed from '../components/mobile/ActivityFeed';
import TeamPresence from '../components/mobile/TeamPresence';
import Notifications from '../components/mobile/Notifications';
import { useWebSocket } from '../hooks/useWebSocket';
import { useNotifications } from '../hooks/useNotifications';

export default function Home() {
  const [robotState, setRobotState] = useState({
    x: 0,
    y: 0,
    rotation: 0,
    battery: 100,
    sensors: {}
  });
  
  const { socket, connected } = useWebSocket();
  const { notifications, addNotification } = useNotifications();

  useEffect(() => {
    if (socket) {
      socket.on('robotUpdate', (data) => {
        setRobotState(data);
      });
      
      socket.on('teamActivity', (activity) => {
        addNotification(activity);
      });
    }
  }, [socket]);

  const handleCommand = (command: string) => {
    if (socket && connected) {
      socket.emit('sendCommand', {
        command,
        userId: 'user-' + Date.now(),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <MobileLayout>
      {/* Header with Team Presence */}
      <div className="header-section">
        <h1>🤖 OpenMind Simulator</h1>
        <TeamPresence />
      </div>

      {/* Notifications */}
      <Notifications notifications={notifications} />

      {/* Main Grid */}
      <div className="grid-section">
        <MobileGrid 
          robotState={robotState}
          onCommand={handleCommand}
        />
      </div>

      {/* Touch Controls */}
      <div className="controls-section">
        <TouchControls onCommand={handleCommand} />
      </div>

      {/* Sensors & Activity */}
      <div className="info-section">
        <SensorCards sensors={robotState.sensors} />
        <ActivityFeed />
      </div>
    </MobileLayout>
  );
}
