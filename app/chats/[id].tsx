import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { socketService } from "../services/socketServices";
import { useAuth } from "../context/authContext";
import { getMessages } from "../services/chatServices";

const ChatScreen = () => {
  const { user, token } = useAuth();
  const { chatId }: any = useLocalSearchParams();
  const [messages, setMessages]: any = useState([]);
  const [message, setMessage]: any = useState("");
  const userId = user?._id;
  console.log("chatId: ", chatId);

  useEffect(() => {
    fetchMessages();
    socketService.joinChat(chatId);

    // Listen for new messages
    socketService.onNewMessage((newMessage) => {
      if (newMessage.chatId === chatId) {
        setMessages((prevMessages: any) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await getMessages(chatId, token);
      setMessages(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    socketService.sendMessage(chatId, userId, message);
    setMessage("");
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{ padding: 10, backgroundColor: "#eee", marginVertical: 5, borderRadius: 10 }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.sender.name}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        style={{ padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 }}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

export default ChatScreen;
