const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Robot state
let robotState = {
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
};

// Connected users
const connectedUsers = new Map();
const activityLog = [];

// Broadcast robot state to all clients
function broadcastRobotState() {
  io.emit('robotUpdate', robotState);
}

// Log activity and broadcast
function logActivity(userId, action, type = 'command') {
  const activity = {
    id: uuidv4(),
    userId,
    user: connectedUsers.get(userId)?.name || 'Unknown',
    action,
    type,
    timestamp: new Date().toISOString()
  };
  
  activityLog.unshift(activity);
  if (activityLog.length > 50) activityLog.pop();
  
  io.emit('teamActivity', activity);
  console.log(`Activity: ${activity.user} - ${action}`);
}

// Handle robot commands
function handleCommand(command, userId) {
  const user = connectedUsers.get(userId);
  
  switch (command) {
    case 'MOVE_FORWARD':
      robotState.y = Math.max(0, robotState.y - 1);
      logActivity(userId, 'moved robot forward');
      break;
      
    case 'MOVE_BACKWARD':
      robotState.y = Math.min(9, robotState.y + 1);
      logActivity(userId, 'moved robot backward');
      break;
      
    case 'ROTATE_LEFT':
      robotState.rotation = (robotState.rotation - 90) % 360;
      logActivity(userId, 'rotated robot left');
      break;
      
    case 'ROTATE_RIGHT':
      robotState.rotation = (robotState.rotation + 90) % 360;
      logActivity(userId, 'rotated robot right');
      break;
      
    case 'STOP':
      logActivity(userId, 'stopped robot', 'system');
      break;
      
    default:
      if (command.startsWith('MOVE_TO:')) {
        const [_, coords] = command.split(':');
        const [x, y] = coords.split(',').map(Number);
        robotState.x = x;
        robotState.y = y;
        logActivity(userId, `moved robot to (${x}, ${y})`);
      }
      break;
  }
  
  // Update sensors randomly for simulation
  robotState.sensors = {
    front: Math.max(0, Math.min(100, robotState.sensors.front + (Math.random() - 0.5) * 10)),
    left: Math.max(0, Math.min(100, robotState.sensors.left + (Math.random() - 0.5) * 10)),
    right: Math.max(0, Math.min(100, robotState.sensors.right + (Math.random() - 0.5) * 10)),
    back: Math.max(0, Math.min(100, robotState.sensors.back + (Math.random() - 0.5) * 10)),
    temperature: 25 + Math.random() * 10
  };
  
  // Simulate battery drain
  robotState.battery = Math.max(0, robotState.battery - 0.1);
  
  broadcastRobotState();
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  const userId = uuidv4();
  const userName = `User-${userId.slice(0, 6)}`;
  
  connectedUsers.set(userId, {
    id: userId,
    name: userName,
    socketId: socket.id,
    connectedAt: new Date()
  });
  
  console.log(`User connected: ${userName} (${socket.id})`);
  
  // Send initial state
  socket.emit('robotUpdate', robotState);
  socket.emit('activityHistory', activityLog.slice(0, 20));
  
  // Notify others
  logActivity(userId, 'joined the simulator', 'system');
  
  // Handle commands from client
  socket.on('sendCommand', (data) => {
    handleCommand(data.command, userId);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
    logActivity(userId, 'left the simulator', 'system');
    console.log(`User disconnected: ${userName}`);
  });
});

// HTTP routes
app.get('/api/status', (req, res) => {
  res.json({
    robot: robotState,
    users: Array.from(connectedUsers.values()),
    activities: activityLog.length
  });
});

app.get('/api/activities', (req, res) => {
  res.json(activityLog.slice(0, 20));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 OpenMind Simulator Backend running on port ${PORT}`);
  console.log(`🤖 Robot initialized at position (${robotState.x}, ${robotState.y})`);
});
