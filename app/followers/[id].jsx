import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { env } from '@/constants/envValues';
import { useAuth } from '../context/authContext';

const FollowersList = () => {
  const auth = useAuth();
  const [followers, setFollowers] = useState([]);

  // Dummy Data for Visualization
  useEffect(() => {
    setFollowers([
      { _id: '1', name: 'John Doe', role: 'Software Engineer', profilePic: 'https://via.placeholder.com/150' },
      { _id: '2', name: 'Jane Smith', role: 'Data Scientist', profilePic: 'https://via.placeholder.com/150' },
      { _id: '3', name: 'Alice Johnson', role: 'Product Manager', profilePic: 'https://via.placeholder.com/150' },
    ]);
  }, []);

  const handleFollowPress = async (userId) => {
    try {
      const response = await axios.post(`${env.API_URL}/users/follow/${auth.user?._id}/${userId}`);
      if (response.status === 200) {
        setFollowers((prev) => prev.map(user => user._id === userId ? { ...user, followed: !user.followed } : user));
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4 mt-8">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold flex-1 text-center">Followers</Text>
      </View>
      
      <FlatList
        data={followers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-gray-100 p-4 mb-3 rounded-lg shadow-md">
            <Image source={{ uri: item.profilePic }} className="size-14 rounded-full" />
            <View className="flex-1 ml-3">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-gray-500 text-sm">{item.role}</Text>
            </View>
            <TouchableOpacity
              className={`p-2 px-3 rounded-full ${item.followed ? 'bg-red-500' : 'bg-green-500'}`}
              onPress={() => handleFollowPress(item._id)}
            >
              <FontAwesome name={item.followed ? 'user-times' : 'user-plus'} size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="ml-2 bg-blue-500 p-2 px-3 rounded-full">
              <FontAwesome name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default FollowersList;
