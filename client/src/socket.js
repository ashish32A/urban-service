import { io } from 'socket.io-client';
import { store } from './store/store';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const token = store.getState().auth.accessToken;
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const token = store.getState().auth.accessToken;
  const s = getSocket();
  if (token && !s.connected) {
    s.auth = { token };
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};
