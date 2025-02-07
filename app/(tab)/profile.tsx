import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, ImageSourcePropType, ActivityIndicator, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import icons from '@/constants/icons';
import { useAuth } from '../context/authContext';
import PostCard from '@/components/Card';
import { router } from 'expo-router';

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
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Logout</Text>}
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

  const confirmLogout = async () => {
    setLoading(true);
    await auth.logout();
    setLoading(false);
    setModalVisible(false);
  };

  const handlePress = (id: string) => router.push(`/posts/${id}`);
  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={auth.user.posts}
        keyExtractor={(item) => item.id}
        renderItem={(item) => (<View className="mt-5">
          <PostCard data={item} onPress={() => { handlePress('1') }} selfId={auth.user.id} />
        </View>
        )}
        ListHeaderComponent={() => (
          <View className="pb-32 px-2 mt-5">
            {/* Header */}
            <View className="flex flex-row items-center justify-between mt-6 mx-2">
              <Text className="text-2xl font-bold">Profile</Text>
              <SettingsItem
                icon={icons.logout}
                title=""
                showArrow={false}
                onPress={() => setModalVisible(true)}
                textStyle="text-danger"
              />
            </View>

            {/* Profile Section */}
            <View className="flex items-center mt-5">
              <Image source={{ uri: auth.user.profilePic }} className="size-32 rounded-full" />
              <TouchableOpacity className="absolute bottom-2 right-16">
                <Image source={icons.edit} className="size-6" />
              </TouchableOpacity>
              <Text className="text-2xl mt-3 font-bold">{auth.user.name}</Text>
              <Text className="text-gray-500 text-sm">{auth.user.role}</Text>
            </View>

            {/* User Info */}
            <View className="mt-6 bg-gray-100 p-4 rounded-lg">
              <Text className="text-lg font-semibold">Contact Info</Text>
              <Text className="text-gray-700">Email: {auth.user.email}</Text>
              <Text className="text-gray-700">Phone: {auth.user.mobile}</Text>
            </View>

            <View className="mt-4 bg-gray-100 p-4 rounded-lg">
              <Text className="text-lg font-semibold">Academic Info</Text>
              <Text className="text-gray-700">Batch: {auth.user.batch}</Text>
              <Text className="text-gray-700">Department: {auth.user.department}</Text>
            </View>

            {/* Social Info */}
            <View className="mt-4 flex flex-row justify-around bg-gray-100 p-4 rounded-lg">
              <View className="items-center">
                <Text className="text-lg font-bold">{auth.user.followers.length}</Text>
                <Text className="text-gray-500 text-sm">Followers</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold">{auth.user.following.length}</Text>
                <Text className="text-gray-500 text-sm">Following</Text>
              </View>
            </View>
            <View className='p-2'>
              <Text className='mt-3 font-bold text-center text-xl'>
                POSTS
              </Text>
            </View>
          </View>
        )} />
      <LogoutConfirmationModal visible={modalVisible} onClose={() => setModalVisible(false)} onConfirm={confirmLogout} loading={loading} />
    </SafeAreaView>
  );
};

export default Profile;
