import { View, Text, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import PostCard from '@/components/Card';
import { router, useLocalSearchParams } from 'expo-router';
import { env } from '@/constants/envValues';
import { useAuth } from '../context/authContext';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const VisitProfile = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [userData, setUserData]: any = useState(null);
  const [userPosts, setUserPosts]: any = useState([]);
  const auth = useAuth();
  const userFollowingList = auth.user.following;
  const [isFollowing, setIsFollowing] = useState(userFollowingList.includes(id));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${env.API_URL}/users/${id}`);
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id, loading2]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userData?.posts || userData.posts.length === 0) return;
      try {
        const postPromises = userData.posts.map(async (postId: string) => {
          const response = await fetch(`${env.API_URL}/posts/${postId}`);
          return response.json();
        });

        const postResponses = await Promise.all(postPromises);
        if (postResponses.length) {
          const fetchedPosts = postResponses.map((res) => res.data);
          const FilteredPost = fetchedPosts.filter((item: any) => item != undefined);
          setUserPosts(FilteredPost);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    if (userData) {
      fetchUserPosts();
    }
  }, [userData]); // Added dependency on userData

  // handle follow/unfollow
  const handleFollowPress = async () => {
    setLoading2(true);
    const action = isFollowing ? "unfollow" : "follow";
    const url = `${env.API_URL}/users/${action}/${auth.user?._id}/${userData._id}`;

    try {
      const response = await axios.post(url);
      if (response.status === 200) {
        // Toggle follow state locally
        setIsFollowing(!isFollowing);

        // Fetch the latest self-data
        const selfResponse = await axios.get(`${env.API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${auth.token}` }, // Add if needed
        });

        if (selfResponse.status === 200) {
          auth.setUser(selfResponse.data.data); // Update auth context
        }
      }
    } catch (error) {
      console.error(`Error updating follow status:`, error);
    } finally {
      setLoading2(false);
    }
  };

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
    <SafeAreaView className="flex-1 mt-5 bg-white">
      {/* Header (Fixed at the Top) */}
      <View className="flex-row mt-3 items-center bg-white p-3 rounded-lg shadow-md">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold flex-1 text-center">{userData.name}</Text>
      </View>

      {/* Scrollable Content (Profile + Posts) */}
      <FlatList
        data={userPosts}
        // keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="mt-5">
            <PostCard data={item} onPress={() => router.push(`/posts/${item._id}`)} selfId={userData._id} />
          </View>
        )}
        ListHeaderComponent={
          <View className="px-2 mt-5">
            {/* Profile Section */}
            <View className="flex items-center mt-5 flex-col">
              <Image source={{ uri: userData.profilePic }} className="size-32 rounded-full" />
              <Text className="text-gray-500 text-sm mt-2">{userData.role}</Text>

              {/* Buttons */}
              <View className="flex-row justify-between items-center gap-5 mt-3">
                <TouchableOpacity className="bg-blue-500 p-3 rounded-full">
                  <FontAwesome name="send" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className={`p-3 rounded-full ${userFollowingList.includes(userData._id) ? "bg-red-500" : "bg-green-500"}`} onPress={handleFollowPress}>
                  <FontAwesome name={userFollowingList.includes(userData._id) ? "user-times" : "user-plus"} size={24} color="white" />
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
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default VisitProfile;
