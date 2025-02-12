import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import UpcomingClass from '@/components/Upcoming'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClassAnnouncement from '@/components/Announcement'
import Resource from '@/components/Resource'
import { useAuth } from '../context/authContext'
import * as ImagePicker from 'expo-image-picker';
import images from '@/constants/images'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios'
import { env } from '@/constants/envValues'
import { router } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const Batch = () => {
  const auth = useAuth();
  const [batchName, setBatchName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields for creating a batch
  const [description, setDescription] = useState('');
  const [batchType, setBatchType] = useState('Public');
  const [institute, setInstitute] = useState('');
  const [profilePic, setProfilePic] = useState('');

  //joining batch
  const [batchCode, setBatchCode] = useState("");
  const [message, setMessage] = useState("");


  // anounncement 
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcements, setAnnouncements]:any = useState([]);

  const getSelfData = async () => {
    try {
      const selfResponse = await axios.get(`${env.API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (selfResponse.status === 200) {
        auth.setUser(selfResponse.data.data);
      }
    } catch (error) {
      console.log("Error retrieving data", error);
    }
  };

  //self data update
  useEffect(() => {
    if (auth.token) {
      getSelfData();
    }
  }, []);

  //fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${env.API_URL}/batches/announcements/`);
        setAnnouncements(response.data.data);
      } catch (error) {
        console.log("console log", error)
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // for creating batch
  const createBatch = async () => {
    try {
      if (!batchName || !description || !batchType || !institute) {
        Alert.alert("Fill all the data");
        return;
      }
      setLoading(true); // Start loading

      const response = await axios.post(`${env.API_URL}/batches/create`, {
        'batchName': batchName,
        description,
        batchType,
        institute,
        profilePic,
      });
      if (response.status == 201) {
        Alert.alert("Batch creation sucessful and now join a batch");
        setBatchName('');
        setDescription('');
        setBatchType('Public');
        setInstitute('');
        setProfilePic('');
        setLoading(false);
      }
      await getSelfData();
    } catch (error) {
      console.error(
        "Error creating batch:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };
  const userBatch = auth.user.batch ? auth.user.batch : '';

  // join batch
  const joinBatch = async () => {
    if (!batchCode) {
      Alert.alert("Error", "Please enter a batch code.");
      return;
    }
    try {
      const { data: batches } = await axios.get(`${env.API_URL}/batches/`);
      const batch = batches.data.find((b: { batchCode: string }) => b.batchCode === batchCode);
      console.log(batch)
      if (!batch) {
        Alert.alert("Error", "Batch not found. Please check the batch code.");
        return;
      }
      await axios.post(`${env.API_URL}/batches/join/${batch._id}`);
      router.replace("/batch"); // Navigate using Expo Router
    } catch (error) {
      console.error("Error joining batch:", error);
      Alert.alert("Error", "Failed to join batch. Please try again.");
    }
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
              value={batchCode}
              onChangeText={setBatchCode}
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

  //make announcements 
  const submitAnnouncement = async () => {
    if (!announcementTitle || !announcementMessage) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post(`${env.API_URL}/batches/announcements/create`, {
        title: announcementTitle,
        message: announcementMessage,
        batchId: userBatch,  // Assuming the first batch
        createdBy: auth.user._id,
      });
      if (response.status === 201) {
        Alert.alert("Success", "Announcement added!");
        setShowAnnouncementForm(false);
        setAnnouncementTitle('');
        setAnnouncementMessage('');
        // Refresh announcements list
        setLoading(true);
      }
    } catch (error) {
      console.error("Error adding announcement:", error);
      Alert.alert("Error", "Failed to add announcement");
    }
  };

  const resources = [
  {
    title: "Binary Search Notes",
    courseName: "DSA",
    details: "Here is a useful resource on Binary Search: http://example.com",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_fx63R8uc1mUtQWlxNgeQe9f-cUPNNGau_w&s",
    ],
  },
  {
    title: "Graph Algorithms Handbook",
    courseName: "Algorithms",
    details: "Comprehensive guide on Graph Algorithms: http://example.com",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuDaqIcN9sqq6rYocvm8EAOmJ84HnvypaxCQ&s",
    ],
  },
  {
    title: "Sorting Techniques PDF",
    courseName: "DSA",
    details: "A PDF on sorting techniques: http://example.com",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiGkN6svJumpLqMfd5LplwCdKftcmPXnFaVw&s",
    ],
  },
  {
    title: "Operating Systems Notes",
    courseName: "OS",
    details: "Notes covering OS concepts: http://example.com",
    images: [
      "https://www.istockphoto.com/photo/cdn-content-delivery-network-text-concept-neon-cdn-network-infrastructure-3d-render-gm1474890310-504563169",
    ],
  },
  {
    title: "Database Management Ebook",
    courseName: "DBMS",
    details: "A helpful ebook on Database Management: http://example.com",
    images: [
      "https://res.cloudinary.com/dax7yvopb/image/upload/v1729916014/sample-image5.png",
    ],
  },
];

  const courses = [
  {
    course: "DSA",
    teacher: "notPirate",
    startTime: "12:00",
  },
  {
    course: "Algorithms",
    teacher: "DrAlgo",
    startTime: "10:30",
  },
  {
    course: "Operating Systems",
    teacher: "OSMaster",
    startTime: "14:00",
  },
  {
    course: "Database Management",
    teacher: "DBGuru",
    startTime: "09:45",
  },
  {
    course: "Computer Networks",
    teacher: "NetNinja",
    startTime: "16:15",
  },
];


  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <View className="flex-row items-center justify-between p-5 bg-indigo-600">
        <Text className="text-white text-2xl font-semibold">CSE 5th</Text>
        <TouchableOpacity
          onPress={() => (router.push(`/batches/${userBatch}`))}
          className="bg-white text-indigo-600 px-2  rounded-lg shadow-lg"
        >
          <MaterialCommunityIcons name="card-account-details-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

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
        ListHeaderComponent={
          <View className="px-5">
            {/* Upcoming Classes Section */}
            <View className="my-5">
              <Text className="font-bold text-xl text-indigo-600">Upcoming Classes</Text>
              <FlatList
                data={courses}
                renderItem={({ item }) => <UpcomingClass course={item.course} teacher={item.teacher} startTime={item.startTime} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-3"
                bounces={false}
              />
            </View>

            {/* Announcements Section */}


            <View className="my-5">
              {showAnnouncementForm ? (
                <View className="w-full flex items-center justify-center">
                  <View className="bg-white p-5 rounded-lg w-3/4">
                    <Text className="text-indigo-600 text-xl font-bold mb-2">Create Announcement</Text>
                    <TextInput
                      className="border px-3 py-2 rounded-lg mb-2"
                      placeholder="Title"
                      value={announcementTitle}
                      onChangeText={setAnnouncementTitle}
                    />
                    <TextInput
                      className="border px-3 py-2 rounded-lg mb-2"
                      placeholder="Message"
                      value={announcementMessage}
                      onChangeText={setAnnouncementMessage}
                      multiline
                    />
                    <View className="flex-row justify-between">
                      <TouchableOpacity
                        onPress={() => setShowAnnouncementForm(false)}
                        className="bg-red-500 px-4 py-2 rounded"
                      >
                        <Text className="text-white">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={submitAnnouncement}
                        className="bg-green-500 px-4 py-2 rounded"
                      >
                        <Text className="text-white">Post</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <>
                  <View className="flex-row justify-between items-center">
                    <Text className="font-bold text-xl text-indigo-600">Announcements</Text>
                    <TouchableOpacity
                      onPress={() => setShowAnnouncementForm(true)}
                      className="bg-indigo-500 rounded-full"
                    >
                      <Ionicons name="add-circle" size={30} color="white" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={announcements}
                    renderItem={({ item }) => (
                      <ClassAnnouncement
                       topic={item.title}
                        
                      description={item.message}
                            time = {item.createdAt}
                      />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: 'row', gap: 12 }}
                    bounces={false}
                  />
                </>
              )}
            </View>



            {/* Resources Section */}
            <View className="my-5">
              <Text className="font-bold text-xl text-indigo-600">Resources</Text>
              <FlatList
                data={resources}
                renderItem={({ item }) => (
                  <Resource
                    title={item.title}
                    courseName={item.courseName}
                    details={item.details}
                    images={item.images}
                  />
                )}

                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex gap-3"
                bounces={false}
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Batch;
