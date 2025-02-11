import { View, Text, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';

const ViewBatch = () => {
  const [members, setMembers] = useState<string[]>([
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'David Williams'
  ]);
  const [newMember, setNewMember] = useState('');

  const addMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()]);
      setNewMember('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center bg-indigo-600 p-4 shadow-lg">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <AntDesign name="arrowleft" size={30} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1 text-center">CSE 5th</Text>
      </View>

      {/* Batch Image */}
      <View className="items-center mt-5">
        <Image
          source={{ uri: 'https://source.unsplash.com/800x400/?university,classroom' }}
          className="w-72 h-36 rounded-lg shadow-md"
          resizeMode="cover"
        />
      </View>

      {/* Batch Info */}
      <View className="px-5 mt-5">
        <Text className="text-lg font-semibold text-gray-800">Batch Code: <Text className="text-indigo-600">CSE2025</Text></Text>
        <Text className="text-base text-gray-600 mt-2">This batch is for students of the 5th semester, focusing on DSA, AI, and Web Development.</Text>
      </View>

      {/* Add Member Section */}
      <View className="flex-row items-center px-5 mt-5">
        <TextInput
          value={newMember}
          onChangeText={setNewMember}
          placeholder="Enter member name"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
        />
        <TouchableOpacity onPress={addMember} className="ml-3 bg-indigo-600 px-4 py-2 rounded-lg shadow-md">
          <Feather name="user-plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Member List */}
      <View className="px-5 mt-5 flex-1">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Batch Members</Text>
        <FlatList
          data={members}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="p-4 bg-white rounded-lg shadow-md mb-2 border border-gray-200">
              <Text className="text-base text-gray-800 font-medium">{item}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewBatch;
