import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [robotState, setRobotState] = useState({
    x: 5,
    y: 5,
    rotation: 0,
    battery: 100,
    sensors: {
      front: 50,
      left: 30,
      right: 40,
      back: 20,
      temperature: 25
    }
  });
  const socketRef = useRef(null);

  // Initialize WebSocket
  useEffect(() => {
    console.log('🔄 Connecting to server...');
    
    const socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✅ Connected to server');
      setConnected(true);
      showNotification('Connected to simulator server', 'success');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.log('❌ Connection error:', error.message);
      showNotification('Failed to connect to server', 'error');
    });

    socket.on('robotUpdate', (data) => {
      console.log('🤖 Robot update received:', data);
      setRobotState(data);
    });

    socket.on('teamActivity', (activity) => {
      console.log('📝 Team activity:', activity);
      showNotification(`${activity.user}: ${activity.action}`, 'info');
    });

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const showNotification = (message, type = 'info') => {
    if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'granted') {
      new Notification('OpenMind Simulator', {
        body: message,
        icon: '/icon.png'
      });
    }
  };

  const sendCommand = (command) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('sendCommand', {
        command,
        userId: 'user-' + Date.now(),
        timestamp: new Date().toISOString()
      });
      console.log(`🎮 Command sent: ${command}`);
      
      // Add vibration for mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } else {
      console.log('❌ Cannot send command: Not connected');
      showNotification('Not connected to server', 'error');
    }
  };

  // Grid for robot movement
  const Grid = () => {
    const gridSize = 10;
    const cellSize = 40;
    
    return (
      <div style={styles.gridContainer}>
        <div style={styles.grid}>
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            const isRobotHere = x === robotState.x && y === robotState.y;
            
            return (
              <div
                key={index}
                style={{
                  ...styles.gridCell,
                  backgroundColor: isRobotHere ? '#4CAF50' : 'rgba(255, 255, 255, 0.05)',
                  border: isRobotHere ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {isRobotHere && (
                  <div style={{
                    fontSize: '20px',
                    transform: `rotate(${robotState.rotation}deg)`,
                    transition: 'transform 0.3s ease'
                  }}>
                    🤖
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🤖</span>
          <span style={styles.logoText}>OpenMind</span>
        </div>
        <nav style={styles.nav}>
          <a href="#simulator" style={styles.navLink}>Simulator</a>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#team" style={styles.navLink}>Team</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>INTRODUCING</div>
          <h1 style={styles.heroTitle}>
            Tech With <span style={{ color: '#667eea' }}>Mind</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Robot can now understand commands in 10 languages with advanced simulation
          </p>
          <p style={styles.heroText}>
            ロボットは10言語の音声コマンドを理解できるようになりました
          </p>
          <div style={styles.heroStats}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>10k+</div>
              <div style={styles.statLabel}>Active Users</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>50+</div>
              <div style={styles.statLabel}>Team Members</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>99%</div>
              <div style={styles.statLabel}>Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" style={styles.simulatorSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Live Robot Simulator</h2>
          <p style={styles.sectionSubtitle}>
            Control the robot in real-time. Perfect for OpenMind team testing.
          </p>
        </div>

        <div style={styles.simulatorContainer}>
          {/* Status Panel */}
          <div style={styles.statusPanel}>
            <div style={styles.statusHeader}>
              <div style={{
                ...styles.statusIndicator,
                backgroundColor: connected ? '#4CAF50' : '#F44336'
              }}>
                {connected ? '●' : '○'}
              </div>
              <span>{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Position</div>
                <div style={styles.statValue}>({robotState.x}, {robotState.y})</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Rotation</div>
                <div style={styles.statValue}>{robotState.rotation}°</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Battery</div>
                <div style={styles.statValue}>{robotState.battery.toFixed(1)}%</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Temperature</div>
                <div style={styles.statValue}>{robotState.sensors.temperature?.toFixed(1) || 25}°C</div>
              </div>
            </div>
          </div>

          {/* Grid and Controls */}
          <div style={styles.mainSimulator}>
            {/* Grid Display */}
            <div style={styles.gridWrapper}>
              <h3 style={styles.gridTitle}>Robot Position Map</h3>
              <Grid />
              <div style={styles.coordinates}>
                Current Position: X={robotState.x}, Y={robotState.y}
              </div>
            </div>

            {/* Control Panel */}
            <div style={styles.controlPanel}>
              <h3 style={styles.controlTitle}>Control Panel</h3>
              
              {/* Directional Controls */}
              <div style={styles.directionalControls}>
                <button 
                  onClick={() => sendCommand('MOVE_FORWARD')}
                  style={styles.controlButton}
                  className="touch-button"
                >
                  ↑ Forward
                </button>
                
                <div style={styles.horizontalControls}>
                  <button 
                    onClick={() => sendCommand('ROTATE_LEFT')}
                    style={styles.controlButton}
                    className="touch-button"
                  >
                    ← Rotate Left
                  </button>
                  
                  <button 
                    onClick={() => sendCommand('STOP')}
                    style={{...styles.controlButton, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'}}
                    className="touch-button"
                  >
                    ⏹️ Stop
                  </button>
                  
                  <button 
                    onClick={() => sendCommand('ROTATE_RIGHT')}
                    style={styles.controlButton}
                    className="touch-button"
                  >
                    → Rotate Right
                  </button>
                </div>
                
                <button 
                  onClick={() => sendCommand('MOVE_BACKWARD')}
                  style={styles.controlButton}
                  className="touch-button"
                >
                  ↓ Backward
                </button>
              </div>

              {/* Quick Actions */}
              <div style={styles.quickActions}>
                <button 
                  onClick={() => sendCommand('MOVE_FORWARD')}
                  style={styles.quickButton}
                >
                  Quick Move
                </button>
                <button 
                  onClick={() => {
                    sendCommand('ROTATE_LEFT');
                    setTimeout(() => sendCommand('MOVE_FORWARD'), 300);
                  }}
                  style={styles.quickButton}
                >
                  Turn & Move
                </button>
                <button 
                  onClick={() => {
                    sendCommand('MOVE_FORWARD');
                    setTimeout(() => sendCommand('MOVE_FORWARD'), 300);
                    setTimeout(() => sendCommand('MOVE_FORWARD'), 600);
                  }}
                  style={styles.quickButton}
                >
                  Fast Move
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Robot understands more languages</h2>
          <p style={styles.sectionSubtitle}>
            ロボットはより多くの言語を理解する
          </p>
        </div>
        
        <div style={styles.featuresGrid}>
          {[
            { icon: '🎮', title: 'Touch Controls', desc: 'Intuitive mobile-first controls' },
            { icon: '🗣️', title: 'Voice Commands', desc: '10+ language support' },
            { icon: '👥', title: 'Team Collaboration', desc: 'Real-time team monitoring' },
            { icon: '📊', title: 'Live Analytics', desc: 'Real-time sensor data' },
            { icon: '🔔', title: 'Smart Notifications', desc: 'Instant team alerts' },
            { icon: '🌐', title: 'Web Based', desc: 'No installation needed' },
          ].map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to revolutionize your team testing?</h2>
          <p style={styles.ctaText}>
            Join thousands of developers using OpenMind Simulator for efficient robot testing.
          </p>
          <div style={styles.ctaButtons}>
            <button 
              style={styles.primaryCta}
              onClick={() => document.getElementById('simulator').scrollIntoView()}
            >
              Try Simulator Free
            </button>
            <button style={styles.secondaryCta}>
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={styles.footerLogoIcon}>🤖</span>
            <span style={styles.footerLogoText}>OpenMind</span>
          </div>
          <p style={styles.footerTagline}>
            "Design by FlutterTop, developed for OpenMind Team"
          </p>
          <div style={styles.footerStats}>
            <div style={styles.footerStat}>
              <div style={styles.footerStatNumber}>10k+</div>
              <div style={styles.footerStatLabel}>Happy Users</div>
            </div>
            <div style={styles.footerStat}>
              <div style={styles.footerStatNumber}>24/7</div>
              <div style={styles.footerStatLabel}>Availability</div>
            </div>
            <div style={styles.footerStat}>
              <div style={styles.footerStatNumber}>100%</div>
              <div style={styles.footerStatLabel}>Open Source</div>
            </div>
          </div>
          <div style={styles.footerCopyright}>
            © 2024 OpenMind Robot Simulator. Made with ❤️ for the OpenMind team.
          </div>
        </div>
      </footer>

      {/* Mobile Notification */}
      {!connected && (
        <div style={styles.connectionAlert}>
          ⚠️ Not connected to server. Please check if backend is running.
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: #0a0a0a;
          color: white;
          overflow-x: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        
        .touch-button {
          transition: all 0.2s ease;
          user-select: none;
        }
        
        .touch-button:active {
          transform: scale(0.95);
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .touch-button {
            min-height: 60px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
    minHeight: '100vh',
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 40px',
    background: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  logoIcon: {
    fontSize: '32px',
  },
  
  logoText: {
    fontWeight: '700',
  },
  
  nav: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  
  navLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  
  hero: {
    padding: '120px 40px 80px',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(102, 126, 234, 0.2)',
    color: '#667eea',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
    border: '1px solid rgba(102, 126, 234, 0.3)',
  },
  
  heroTitle: {
    fontSize: '64px',
    fontWeight: '800',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #ffffff 0%, #a8edea 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  heroSubtitle: {
    fontSize: '24px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '16px',
    lineHeight: 1.5,
  },
  
  heroText: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '48px',
    fontStyle: 'italic',
  },
  
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    marginTop: '48px',
  },
  
  statItem: {
    textAlign: 'center',
  },
  
  statNumber: {
    fontSize: '40px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  statLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '8px',
  },
  
  simulatorSection: {
    padding: '80px 40px',
    background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
  },
  
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  
  sectionTitle: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  sectionSubtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.7)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  simulatorContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  statusPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    fontSize: '18px',
    fontWeight: '600',
  },
  
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  
  statCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  
  statLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '8px',
  },
  
  statValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#667eea',
  },
  
  mainSimulator: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    marginTop: '32px',
  },
  
  gridWrapper: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  
  gridTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'white',
  },
  
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 40px)',
    gridTemplateRows: 'repeat(10, 40px)',
    gap: '2px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '10px',
    borderRadius: '10px',
    border: '2px solid rgba(102, 126, 234, 0.3)',
  },
  
  gridCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  },
  
  coordinates: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    padding: '10px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  
  controlPanel: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  
  controlTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '32px',
    color: 'white',
  },
  
  directionalControls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  },
  
  horizontalControls: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  
  controlButton: {
    padding: '20px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    minWidth: '140px',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
  },
  
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    marginTop: '24px',
  },
  
  quickButton: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  featuresSection: {
    padding: '80px 40px',
    background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
  },
  
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  featureCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '32px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  
  featureIcon: {
    fontSize: '48px',
    marginBottom: '24px',
  },
  
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: 'white',
  },
  
  featureDesc: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.6,
  },
  
  ctaSection: {
    padding: '120px 40px',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)',
    textAlign: 'center',
  },
  
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  
  ctaTitle: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '24px',
    color: 'white',
  },
  
  ctaText: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '48px',
    lineHeight: 1.6,
  },
  
  ctaButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
  },
  
  primaryCta: {
    padding: '20px 40px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 30px rgba(102, 126, 234, 0.4)',
  },
  
  secondaryCta: {
    padding: '20px 40px',
    background: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  footer: {
    padding: '60px 40px 40px',
    background: '#0a0a0a',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  footerContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  
  footerLogo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  footerLogoIcon: {
    fontSize: '32px',
  },
  
  footerLogoText: {
    fontWeight: '700',
  },
  
  footerTagline: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '48px',
    fontStyle: 'italic',
  },
  
  footerStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    marginBottom: '48px',
  },
  
  footerStat: {
    textAlign: 'center',
  },
  
  footerStatNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '8px',
  },
  
  footerStatLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  
  footerCopyright: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.4)',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  connectionAlert: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(244, 67, 54, 0.9)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(244, 67, 54, 0.4)',
    zIndex: 1000,
    animation: 'pulse 2s infinite',
  },
};

// Add keyframes for animation
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleTag);
}
