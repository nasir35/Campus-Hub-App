import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { env } from '@/constants/envValues';
import { useAuth } from '../context/authContext';
import axios from 'axios';

const FollowerList = () => {
  const [followerIds, setFollowerIds] = useState([]); // Store just the IDs
  const [followerUsers, setFollowerUsers] = useState([]); // Store full user data
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`${env.API_URL}/users/${auth.user?._id}`);
        const ids = response.data.data.followers;
        setFollowerIds(ids); // Store the IDs
        // Fetch full user details
        const userDetails = await Promise.all(
          ids.map(id => axios.get(`${env.API_URL}/users/${id}`).then(res => res.data.data))
        );
        setFollowerUsers(userDetails);
      } catch (error) {
        console.error('Error fetching following list:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [auth.user, loading2]);


  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" className="text-primary-300 mt-5" />
      </View>
    );
  }

  // handle follow/unfollow
  const handleFollowPress = async (id) => {
    setLoading2(true)
    const url = `${env.API_URL}/users/follow/${auth.user?._id}/${id}`;

    try {
      const response = await axios.post(url);
      if (response.status === 200) {
      }
    } catch (error) {
      console.error(`Error updating follow status:`, error);
    }finally{
      setLoading2(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4 mt-8">
        <TouchableOpacity onPress={() => router.push('../(tab)/profile')}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold flex-1 text-center">Followers</Text>
      </View>

      <FlatList
        data={followerUsers}
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
            {/* <TouchableOpacity className="bg-green-500 p-2 rounded-lg" onPress={()=>{handleFollowPress(item._id)}}>
              <FontAwesome name="user-times" size={18} color="white" />
            </TouchableOpacity> */}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default FollowerList;
