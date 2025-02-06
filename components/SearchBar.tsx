import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SearchBar() {
  return (
    <View className="flex-row items-center p-3 bg-gray-200">
      <TextInput className="flex-1 p-2 bg-white rounded-md" placeholder="Search..." placeholderTextColor="#888" />
      <TouchableOpacity>
        <MaterialIcons name="filter-list" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
