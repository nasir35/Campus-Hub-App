import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { useLocalSearchParams, router} from "expo-router";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import image from '@/constants/images';
import icons from '@/constants/icons'

const chatData = {
  "1": { name: "John Doe", avatar: "https://example.com/john.jpg" },
  "2": { name: "Alice Smith", avatar: "https://example.com/alice.jpg" },
};

export default function SingleChat() {
  const { id } = useLocalSearchParams(); // Get chat ID from URL
  const chatUser = chatData[id] || { name: "Unknown", avatar: "" };

  const [messages, setMessages] = useState([
    { id: "1", text: "Hey! How are you?", sender: "friend" },
    { id: "2", text: "I'm good, what about you?", sender: "me" },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;
    const newMessage = { id: Date.now().toString(), text: inputText, sender: "me" };
    setMessages([ newMessage, ...messages]);
    setInputText("");
  };

  return (
    
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between bg-white p-3 rounded-lg shadow-md mb-4">
          <TouchableOpacity onPress={()=>{router.push('../(tab)/chat')}} >
            <Image source={icons.backArrow} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">{chatUser.name}</Text>
          <Image source={image.avatar} className="size-12 rounded-full mr-3" />
        </View>

        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className={`flex-row items-center mb-3 ${item.sender === "me" ? "justify-end" : "justify-start"}`}>
              {item.sender !== "me" && <Image source={icons.google} className="size-10 rounded-full mr-3" />}
              <View className={`p-3 rounded-lg max-w-[75%] ${item.sender === "me" ? "bg-blue-500" : "bg-white"}`}>
                <Text className={item.sender === "me" ? "text-white" : "text-black"}>{item.text}</Text>
              </View>
            </View>
          )}
          inverted
        />

        {/* Input Field */}
        <View className="flex-row items-center bg-white p-3 rounded-full shadow-md">
          <TextInput
            className="flex-1 text-base px-3"
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={sendMessage} className="ml-3">
            <Feather name="send" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
