import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Alert } from "react-native";

// Define types for the socket context
interface SocketContextType {
  socket: Socket | null;
  joinChat: (chatId: string) => void;
  sendMessage: (chatId: string, senderId: string, content: string) => void;
  receiveMessage: (callback: (message: any) => void) => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Provider component
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // Connect to the Socket.IO server
  useEffect(() => {
    const socketInstance = io("http://localhost:5000/", {
      transports: ["websocket"],
      reconnectionAttempts: 5, // Reconnect attempts
    });

    socketInstance.on("connect", () => {
      console.log("Socket.IO connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      Alert.alert("Socket connection error", "Unable to connect to the server.");
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("Socket.IO disconnected on cleanup");
      }
    };
  }, []);

  // Join a chat room
  const joinChat = (chatId: string) => {
    if (socket) {
      socket.emit("join_chat", chatId);
      console.log(`Joined chat room: ${chatId}`);
    }
  };

  // Send a message to a chat room
  const sendMessage = (chatId: string, senderId: string, content: string) => {
    if (socket) {
      socket.emit("send_message", { chatId, senderId, content });
      console.log(`Sent message to chat room ${chatId}`);
    }
  };

  // Receive a message
  const receiveMessage = (callback: (message: any) => void) => {
    if (socket) {
      socket.on("receive_message", callback);
    }
  };

  // Disconnect from the Socket.IO server
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      console.log("Disconnected from Socket.IO");
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinChat, sendMessage, receiveMessage, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
