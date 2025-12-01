import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // In development, connect to local backend
    const socketUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001' 
      : window.location.origin;

    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    setSocket(socketRef.current);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { socket, connected };
}
