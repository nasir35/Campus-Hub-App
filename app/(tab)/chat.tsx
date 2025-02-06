import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import {router} from 'expo-router';
import image from '@/constants/images'

const chats = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Hey! How are you?",
    time: "10:30 AM",
    avatar: "https://example.com/john.jpg",
  },
  {
    id: "2",
    name: "Alice Smith",
    lastMessage: "Let's meet tomorrow!",
    time: "9:15 AM",
    avatar: "https://example.com/alice.jpg",
  },
];

export default function Chat() {

  const handleChatPress = (id:string) => {router.push(`/chats/${id}`), console.log('bal')};
  return (
    <View className="mt-10 flex-1 bg-gray-100 p-4">
      <View className="flex flex-row items-center justify-center">
        <Text className="p-5 text-xl font-bold">CampusHub</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center bg-white p-4 rounded-lg shadow-md mb-3"
            onPress={() => {handleChatPress('1')}}
          >
            <Image source={image.avatar} className="size-16 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="text-lg font-bold">{item.name}</Text>
              <Text className="text-gray-500">{item.lastMessage}</Text>
            </View>
            <Text className="text-gray-400">{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


