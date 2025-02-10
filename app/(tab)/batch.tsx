import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import UpcomingClass from '@/components/Upcoming'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClassAnnouncement from '@/components/Announcement'
import Resource from '@/components/Resource'
import { useAuth } from '../context/authContext'
import * as ImagePicker from 'expo-image-picker';
import images from '@/constants/images'
import { Picker } from '@react-native-picker/picker';


const Batch = () => {
  const auth = useAuth();
  const userBatch = auth.user.batch? auth.user.batch[0] : '';
  const [batchName, setBatchName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form fields for creating a batch
  const [description, setDescription] = useState('');
  const [batchType, setBatchType] = useState('Public');
  const [institute, setInstitute] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const joinBatch = () => {
    if (batchName.trim()) {
      console.log(`Joining batch: ${batchName}`);
      // Implement API call or state update to join batch
    }
  };

  const createBatch = () => {
    console.log({
      batchName,
      description,
      batchType,
      institute,
      profilePic,
    });
    // Implement API call to create a batch
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  if (!userBatch) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-4">


        {!showCreateForm ? (
          <>
            <Image source={images.noResult} resizeMode='cover' className='w-32 h-32 mb-10' />
            <Text className="text-xl font-bold mb-3">You're not in a batch yet!</Text>
            <Text className="text-gray-600 mb-5">Join an existing batch or create a new one.</Text>
            <TextInput
              className="border w-64 px-3 py-2 rounded-lg"
              placeholder="Enter batch name"
              value={batchName}
              onChangeText={setBatchName}
            />

            <View className="flex-row gap-4 mt-4">
              <TouchableOpacity onPress={joinBatch} className="bg-blue-500 px-4 py-2 rounded">
                <Text className="text-white font-bold">Join Batch</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowCreateForm(true)} className="bg-green-500 px-4 py-2 rounded">
                <Text className="text-white font-bold">Create Batch</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="w-full p-4 bg-gray-100 rounded-lg mt-4">
            {/* Batch Creation Illustration */}
            <View className="items-center mb-4">
              <Image
                source={images.group}
                className="w-32 h-32"
              />
              <Text className="text-xl font-bold mt-2">Create a New Batch</Text>
              <Text className="text-gray-600 text-sm text-center">Organize and manage your study group efficiently!</Text>
            </View>

            {/* Batch Name Input */}
            <TextInput
              className="border px-3 py-2 rounded-lg mb-2"
              placeholder="Batch Name"
              value={batchName}
              onChangeText={setBatchName}
            />

            {/* Description Input */}
            <TextInput
              className="border px-3 py-2 rounded-lg mb-2"
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {/* Institute Input */}
            <TextInput
              className="border px-3 py-2 rounded-lg mb-2"
              placeholder="Institute"
              value={institute}
              onChangeText={setInstitute}
            />

            {/* select batch type */}
            <View className="mb-2">
              <View className="border border-gray-400 rounded-lg flex-row items-center bg-white">
                <Picker
                  selectedValue={batchType}
                  onValueChange={(itemValue) => setBatchType(itemValue)}
                  style={{ flex: 1 }}
                  mode="dropdown" // Makes it more user-friendly
                >
                  <Picker.Item label="Public" value="Public" />
                  <Picker.Item label="Private" value="Private" />
                </Picker>
              </View>
            </View>

            {/* Profile Picture Picker */}
           <TouchableOpacity onPress={pickImage} className="bg-blue-500 px-6 py-3 rounded-lg mb-3 shadow-lg flex-row items-center justify-center">
              <Text className="text-white font-bold text-lg">📷 Pick Profile Picture</Text>
            </TouchableOpacity>

            {profilePic ? <Image source={{ uri: profilePic }} className="w-20 h-20 rounded-full mb-2" /> : null}

            {/* Submit & Cancel Buttons */}
            <View className='flex-row items-center justify-between'>
              <TouchableOpacity onPress={createBatch} className="bg-green-500 px-4 py-2 rounded w-1/2 mr-2">
                <Text className="text-white font-bold text-center">Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowCreateForm(false)} className="bg-red-500 px-4 py-2 rounded w-1/2">
                <Text className="text-white font-bold text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        data={[1, 2, 3, 4, 6, 7]}
        renderItem={(item) => (
          <View className="ml-5 mt-5">
            <Resource
              title="Red Black pdf sheet added"
              courseName="DSA"
              details="hello is this is the resource http://www.google.com"
              images={[
                'https://res.cloudinary.com/dax7yvopb/image/upload/v1729916014/mdnasir3-10:13:33-26-10-2024.png',
                'https://res.cloudinary.com/dax7yvopb/image/upload/v1729916014/mdnasir3-10:13:33-26-10-2024.png',
                'https://res.cloudinary.com/dax7yvopb/image/upload/v1729916014/mdnasir3-10:13:33-26-10-2024.png',
              ]}
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <View>
            <View className="ml-5 mt-5 text-red-400">
              <Text className="font-bold text-xl">Upcoming Class</Text>
            </View>
            <FlatList
              data={[1, 2, 3]}
              renderItem={({ item }) => <UpcomingClass course="DSA" teacher="notPirate" startTime="12:00" />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex gap-1"
              bounces={false}
            />
            <View className="ml-5 mt-5 text-red-400">
              <Text className="font-bold text-xl">Announcements</Text>
            </View>
            <FlatList
              data={[1, 2, 3]}
              renderItem={({ item }) => (
                <ClassAnnouncement
                  topic="Islamic Seminar"
                  time="12:00"
                  from="12 batch"
                  description="This will select the next occurrence of the word or text that you have selected. If you keep pressing the shortcut, it will keep selecting the next occurrences."
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex gap-1"
              bounces={false}
            />
            <View className="ml-5">
              <Text className="font-bold text-xl">Resources</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Batch;
