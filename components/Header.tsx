import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import images from "@/constants/images";

export default function Header({ toggleSearch }: { toggleSearch: () => void }) {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-row justify-between items-center p-4 bg-white shadow-md mx-2 rounded-md">
      {/* Logo Section */}
      <TouchableOpacity>
        <Text className="font-bold text-lg">CampusHub</Text>
      </TouchableOpacity>

      {/* Icons Section */}
      <View className="flex-row items-center gap-6">
        {/* Search Icon */}
        <TouchableOpacity onPress={toggleSearch} className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500">
          <Feather name="search" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Notifications Icon */}
        <TouchableOpacity className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500">
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
