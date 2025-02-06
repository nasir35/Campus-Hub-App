import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export default function Header({ toggleSearch }: { toggleSearch: () => void }) {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-row justify-between p-4 bg-gray-100">
      <TouchableOpacity>
        <Text className="font-bold text-xl">CampusHub</Text>
      </TouchableOpacity>
      <View className="flex-row items-center gap-5">
        <TouchableOpacity onPress={toggleSearch}>
          <Feather name="search" size={24} color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
