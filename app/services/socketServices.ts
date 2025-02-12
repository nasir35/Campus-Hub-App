import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://192.168.1.3:5000/";

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    this.socket = io(SERVER_URL, { query: { userId } });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  }

  joinChat(chatId: string) {
    this.socket?.emit("join_chat", chatId);
  }

  sendMessage(chatId: string, senderId: string, content: string) {
    this.socket?.emit("send_message", { chatId, senderId, content });
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on("receive_message", callback);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = new SocketService();
