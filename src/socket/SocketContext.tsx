// src/socket/SocketContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth, useAuthContext } from "../context/AuthContext"; // Adjust the import path as needed

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

const SOCKET_URL = `http://localhost:5000`; // Adjust this to your backend URL

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { authUser } = useAuthContext(); // Get user from your auth context

  useEffect(() => {
    if (authUser) {
      // Create socket connection when user is authenticated
      const newSocket = io(SOCKET_URL, {
        autoConnect: true,
        query: {
          userId: authUser.id, // Assuming user object has an id field
        },
        auth: {
          token: authUser.token, // Assuming you have a token in user object
        },
      });

      // Socket event listeners
      newSocket.on("connect", () => {
        // console.log("Socket connected");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        // console.log("Socket disconnected");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Cleanup on unmount or when user changes
      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
