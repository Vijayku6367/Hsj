import { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  status: 'online' | 'away' | 'busy';
  lastActivity: string;
}

export default function TeamPresence() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    // Mock team data
    const mockTeam: TeamMember[] = [
      { id: '1', name: 'You', status: 'online', lastActivity: new Date().toISOString() },
      { id: '2', name: 'Alex', status: 'online', lastActivity: new Date(Date.now() - 120000).toISOString() },
      { id: '3', name: 'Rohan', status: 'away', lastActivity: new Date(Date.now() - 300000).toISOString() },
      { id: '4', name: 'Priya', status: 'online', lastActivity: new Date(Date.now() - 60000).toISOString() },
    ];
    setTeamMembers(mockTeam);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'busy': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="team-presence">
      <div className="team-header">
        <span>👥 Team</span>
        <div className="online-count">
          {teamMembers.filter(m => m.status === 'online').length} online
        </div>
      </div>
      
      <div className="team-members">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-member">
            <div className="member-avatar">
              <div 
                className="status-dot"
                style={{ backgroundColor: getStatusColor(member.status) }}
              />
              {member.name.charAt(0)}
            </div>
            <div className="member-info">
              <div className="member-name">{member.name}</div>
              <div className="member-status">{member.status}</div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .team-presence {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 15px;
        }
        
        .team-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          color: white;
          font-weight: 600;
        }
        
        .online-count {
          background: rgba(76, 175, 80, 0.3);
          color: #4CAF50;
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: normal;
        }
        
        .team-members {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .team-member {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          transition: background 0.2s;
        }
        
        .team-member:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .member-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          position: relative;
        }
        
        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.3);
        }
        
        .member-info {
          flex: 1;
        }
        
        .member-name {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }
        
        .member-status {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
}
