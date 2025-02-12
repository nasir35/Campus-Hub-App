import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { socketService } from "../services/socketServices";
import { getUserChats } from "../services/chatServices";
import { useAuth } from "../context/authContext";

const Chat = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = user?._id; // Replace with actual user ID

  useEffect(() => {
    setLoading(true);
    if (!user) {
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchChats();
    socketService.connect(userId);

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchChats = async () => {
    try {
      const response = await getUserChats(userId, token);
      setChats(response);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user)
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => {
          console.log("first: ", item._id);
          return (
            <TouchableOpacity
              style={{ padding: 16, borderBottomWidth: 1, borderColor: "#ddd" }}
              onPress={() => router.push(`/chats/${item._id}`)}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name || "Chat"}</Text>
              {item.lastMessage && (
                <Text style={{ color: "gray" }}>{item.lastMessage.content}</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Chat;
