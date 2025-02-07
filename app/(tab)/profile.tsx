import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, ImageSourcePropType, Alert, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import icons from '@/constants/icons';
import images from '@/constants/images';
import { settings } from '@/constants/data';
import { useAuth } from '../context/authContext';


interface SettingsItemProps {
  icon:ImageSourcePropType,
  title:string,
  onPress?:()=>void,
  textStyle?:string,
  showArrow?:boolean
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow = true }: SettingsItemProps) => (
    <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between py-3'>
      <View className='flex flex-row items-center gap-3'>
        <Image source={icon} className='size-6' />
        <Text className={`text-lg text-black-300 ${textStyle}`}>{title}</Text>
      </View>
      {showArrow && <Image source={icons.rightArrow} className='size-6' />}
    </TouchableOpacity>
  )

const profile = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const confirmLogout = async () => {
    setLoading(true);
    await auth.logout();
    setLoading(false);
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 px-7 mt-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-2xl font-bold">Profile</Text>
          <Image source={icons.bell} className="size-6" />
        </View>

        <View className='"flex-row justify-center flex mt-5'>
          <View className="flex flex-col items-center relative mt-5">
            <Image source={images.avatar} className="size-32 relative rounded-full" />
            <TouchableOpacity className="absolute bottom-11 right-32">
              <Image source={icons.edit} className="size-6" />
            </TouchableOpacity>
            <Text className="text-2xl mt-2 font-bold">Pirate</Text>
          </View>
        </View>

        <View>
          <SettingsItem icon={icons.calendar} title="My Bookings" />
          <SettingsItem icon={icons.wallet} title="Payment" />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>
        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            showArrow={false}
            onPress={() => setModalVisible(true)} // Show modal instead of alert
            textStyle="text-danger"
          />

          {/* Custom Logout Confirmation Modal */}
          <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white p-4 rounded-lg w-80">
                <Text className="text-lg font-bold">Confirm Logout</Text>
                <Text className="mt-2">Are you sure you want to log out?</Text>

                <View className="flex-row justify-end mt-6 gap-x-5">
                  <TouchableOpacity onPress={() => setModalVisible(false)} className="px-6 py-2 rounded bg-gray-200">
                    <Text className="text-gray-800">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={confirmLogout} className="px-6 py-2 rounded bg-red-600">
                    {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Logout</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default profile;