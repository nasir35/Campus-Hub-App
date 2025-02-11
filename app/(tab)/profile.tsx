import { View, Text, SafeAreaView, Image, TouchableOpacity, ImageSourcePropType, ActivityIndicator, Modal, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import icons from '@/constants/icons';
import { useAuth } from '../context/authContext';
import PostCard from '@/components/Card';
import { router } from 'expo-router';
import { env } from '@/constants/envValues';
import PostInput from '@/components/PostInput';
import axios from 'axios';

interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow = true }: SettingsItemProps) => (
  <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between '>
    <View className='flex flex-row items-center gap-3'>
      <Image source={icon} className='size-6' />
      <Text className={`text-lg text-black-300 ${textStyle}`}>{title}</Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} className='size-6' />}
  </TouchableOpacity>
);

const LogoutConfirmationModal = ({ visible, onClose, onConfirm, loading }: { visible: boolean, onClose: () => void, onConfirm: () => void, loading: boolean }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-white p-4 rounded-lg w-80">
        <Text className="text-lg font-bold">Confirm Logout</Text>
        <Text className="mt-2">Are you sure you want to log out?</Text>

        <View className="flex-row justify-end mt-6 gap-x-5">
          <TouchableOpacity onPress={onClose} className="px-6 py-2 rounded bg-gray-200">
            <Text className="text-gray-800">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onConfirm} className="px-6 py-2 rounded bg-red-600">
            {loading ? <ActivityIndicator className="flex items-center justify-center" color="#fff" /> : <Text className="text-white font-bold">Logout</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const Profile = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userPosts, setUserPosts]: any = useState([]);

  const confirmLogout = async () => {
    setLoading(true);
    await auth.logout();
    setLoading(false);
    setModalVisible(false);
  };

  // console.log(auth.user.posts);
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!auth.user?.posts || auth.user.posts.length === 0) return;
      try {
        const postPromises = auth.user.posts.map(async (postId: string) => {
          const response = await fetch(`${env.API_URL}/posts/${postId}`);
          return response.json();
        });

        const postResponses = await Promise.all(postPromises);
        if (postResponses.length) {
          const fetchedPosts = postResponses.map((res) => res.data);
          const filteredPosts = fetchedPosts.filter((item: any) => item !== undefined);

          // Reverse the order to show the most recent post first
          setUserPosts(filteredPosts.reverse());
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    if (auth.user) {
      fetchUserPosts();
    }
  }, [auth.token]);


  return (
    <SafeAreaView className="bg-white">
      {/* Header */}
      <View className="flex flex-row items-center justify-between mt-10 mx-2">
        <Text className="text-2xl font-bold">Profile</Text>
        <SettingsItem
          icon={icons.logout}
          title=""
          showArrow={false}
          onPress={() => setModalVisible(true)}
          textStyle="text-danger"
        />
      </View>
      <FlatList
        data={userPosts}
        renderItem={(item) => (<View className="mt-5">
          <PostCard data={item.item} onPress={() => router.push(`/posts/${item.item._id}`)} selfId={auth.user.id} />
        </View>
        )}
        ListHeaderComponent={<>
          {/* Profile Section */}
          <View className="px-4 mt-5 items-center">
            <Image source={{ uri: auth.user.profilePic }} className="size-32 rounded-full border-4 border-indigo-600" />
            <TouchableOpacity className="absolute bottom-2 right-16">
              <Image source={icons.edit} className="size-6 opacity-70" />
            </TouchableOpacity>
            <Text className="text-2xl mt-3 font-bold text-gray-900">{auth.user.name}</Text>
            <Text className="text-gray-500 text-sm">{auth.user.role}</Text>
          </View>

          {/* Info Sections */}
          <View className="mt-6 px-4">
            {/* Contact Info */}
            <View className="bg-indigo-50 p-4 rounded-lg">
              <Text className="text-lg font-semibold text-indigo-600">Contact Info</Text>
              <Text className="text-gray-700">📧 Email: {auth.user.email}</Text>
              <Text className="text-gray-700">📞 Phone: {auth.user.mobile}</Text>
            </View>

            {/* Academic Info */}
            <View className="mt-4 bg-indigo-50 p-4 rounded-lg">
              <Text className="text-lg font-semibold text-indigo-600">Academic Info</Text>
              <Text className="text-gray-700">🎓 Batch: {auth.user.batch}CSE</Text>
              <Text className="text-gray-700">🏛️ Department: {auth.user.department}CSE</Text>
            </View>

            {/* Social Info */}
            <View className="mt-4 flex flex-row justify-around bg-indigo-50 p-4 rounded-lg">
              <TouchableOpacity onPress={() => router.push(`../followers/${auth.user._id}`)}>
                <View className="items-center">
                  <Text className="text-lg font-bold text-indigo-600">{auth.user.followers.length}</Text>
                  <Text className="text-gray-500 text-sm">Followers</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push(`../followings/${auth.user._id}`)}>
                <View className="items-center">
                  <Text className="text-lg font-bold text-indigo-600">{auth.user.following.length}</Text>
                  <Text className="text-gray-500 text-sm">Following</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Post Section */}
          <View className="mt-6 mx-4 bg-indigo-50 p-4 rounded-lg items-center">
            <Text className="text-lg font-semibold text-indigo-600">Create & View Your Posts</Text>
          </View>

          {/* Post Input Component */}
          <View className="px-4">
            <PostInput />
          </View>
        </>}
      />
      <LogoutConfirmationModal visible={modalVisible} onClose={() => setModalVisible(false)} onConfirm={confirmLogout} loading={loading} />
    </SafeAreaView>
  );
};

export default Profile;
