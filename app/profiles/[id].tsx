import { View, Text, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import PostCard from '@/components/Card';
import { router, useLocalSearchParams } from 'expo-router';
import { env } from '@/constants/envValues';
import { useAuth } from '../context/authContext';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const VisitProfile = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData]: any = useState(null);
  const auth = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${env.API_URL}/users/${id}`);
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  // Redirect if visiting own profile
  useEffect(() => {
    if (userData?._id && auth.user?._id && userData._id === auth.user._id) {
      router.push('/(tab)/profile');
    }
  }, [userData, auth.user]);

  if (loading) {
    return (
      <SafeAreaView className="h-full flex justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView className="h-full flex justify-center items-center bg-white">
        <Text className="text-lg text-gray-700">User not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white mt-5">
      <FlatList
        data={userData.posts}
        keyExtractor={(item) => item._id || item.id} // Ensure key is valid
        renderItem={({ item }) => (
          <View className="mt-5">
            <PostCard data={item} onPress={() => router.push(`/posts/${item._id}`)} selfId={userData._id} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="pb-32 px-2 mt-5">
            {/* Header */}
            <View className="flex-row items-center bg-white p-3 rounded-lg shadow-md mb-4">
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={30} color="black" />
              </TouchableOpacity>
              <Text className="text-lg font-bold flex-1 text-center">{userData.name}</Text>
            </View>

            {/* Profile Section */}
            <View className="flex items-center mt-5 flex-col">
              <Image source={{ uri: userData.profilePic }} className="size-32 rounded-full" />
              {/* Role Text */}
              <Text className="text-gray-500 text-sm mt-2">{userData.role}</Text>

              {/* Buttons container */}
              <View className="flex-row justify-between items-center gap-5 mt-3">
                <TouchableOpacity className="bg-blue-500 p-3 rounded-full" onPress={() => console.log('Send message')}>
                  <FontAwesome name="send" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-green-500 p-3 rounded-full" onPress={() => console.log('Add friend')}>
                  <FontAwesome name="user-plus" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* User Info */}
            <View className="mt-6 bg-gray-100 p-4 rounded-lg">
              <Text className="text-lg font-semibold">Contact Info</Text>
              <Text className="text-gray-700">Email: {userData.email}</Text>
              <Text className="text-gray-700">Phone: {userData.mobile}</Text>
            </View>

            {/* Academic Info */}
            <View className="mt-4 bg-gray-100 p-4 rounded-lg">
              <Text className="text-lg font-semibold">Academic Info</Text>
              <Text className="text-gray-700">Batch: {userData.batch}</Text>
              <Text className="text-gray-700">Department: {userData.department}</Text>
            </View>

            {/* Social Info */}
            <View className="mt-4 flex flex-row justify-around bg-gray-100 p-4 rounded-lg">
              <View className="items-center">
                <Text className="text-lg font-bold">{userData.followers?.length || 0}</Text>
                <Text className="text-gray-500 text-sm">Followers</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold">{userData.following?.length || 0}</Text>
                <Text className="text-gray-500 text-sm">Following</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default VisitProfile;
