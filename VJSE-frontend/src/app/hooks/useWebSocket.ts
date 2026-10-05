import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance || !socketInstance.connected) {
    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000
    });
  }
  return socketInstance;
}

export function useWebSocket(user: { id: number; role: string } | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[WebSocket] Connected:', socket.id);
      // Join room based on user role
      socket.emit('join-room', {
        role: user.role,
        userId: user.id
      });
    });

    socket.on('connect_error', (error) => {
      console.warn('[WebSocket] Connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
    });

    return () => {
      // Do not disconnect on unmount — keep connection alive across navigation
      // Only remove specific listeners
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [user?.id, user?.role]);

  const on = useCallback((event: string, handler: (data: any) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const isConnected = useCallback(() => {
    return socketRef.current?.connected || false;
  }, []);

  return { on, emit, isConnected };
}
