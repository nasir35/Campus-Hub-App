import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { env } from '@/constants/envValues';
import { useAuth } from '../context/authContext';
import axios from 'axios';

const FollowingList = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    setFollowing([
      { _id: '1', name: 'John Doe', role: 'Software Engineer', profilePic: 'https://via.placeholder.com/150' },
      { _id: '2', name: 'Jane Smith', role: 'Data Scientist', profilePic: 'https://via.placeholder.com/150' },
      { _id: '3', name: 'Alice Johnson', role: 'Product Manager', profilePic: 'https://via.placeholder.com/150' },
    ]);
  }, []);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`${env.API_URL}/users/${auth.user?._id}/following`);
        setFollowing(response.data.following);
      } catch (error) {
        console.error('Error fetching following list:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [auth.user]);

  if (loading) {
    return (
      <SafeAreaView className="h-full flex justify-center items-center bg-white">
        <Text className="text-lg text-gray-700">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4 mt-8">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold flex-1 text-center">Followers</Text>
      </View>

      <FlatList
        data={following}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-gray-100 p-4 mb-2 rounded-lg shadow-sm">
            <Image source={{ uri: item.profilePic }} className="size-12 rounded-full" />
            <View className="ml-3 flex-1">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-gray-500 text-sm">{item.role}</Text>
            </View>
            <TouchableOpacity className="bg-blue-500 p-2 rounded-lg mr-2">
              <FontAwesome name="send" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-500 p-2 rounded-lg">
              <FontAwesome name="user-times" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default FollowingList;