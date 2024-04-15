import { createContext } from "react";
import  { io, Socket } from "socket.io-client";

// Define the shape of the context data
interface SocketContextType {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

// Create the context with an initial value
export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

const SOCKET_URL = `http://localhost:5000`;
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  query: {
    userId: 1234,
  },
});


