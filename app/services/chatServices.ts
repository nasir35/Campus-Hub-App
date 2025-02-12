import axios from "axios";

const API_URL = "http://192.168.1.3:5000/api/chat"; // Replace with actual backend URL

export const getUserChats = async (userId: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/userChat/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

export const getMessages = async (chatId: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
  try {
    const response = await axios.post(`${API_URL}/send/${chatId}`, { senderId, content });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
