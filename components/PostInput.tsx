import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // Icon library
import { env } from "@/constants/envValues";
import axios from "axios";
import { uploadImageToCloudinary } from "@/utils/cloudinaryUpload";
import { useEffect } from "react";
import { router } from "expo-router";


export default function PostInput() {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser]:any = useState()
  const [refreshing, setRefreshing] = useState(false);
  // getting user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${env.API_URL}/users/me`);
        if (response.status === 200) { 
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [])

  if(loading)return <ActivityIndicator size='large'></ActivityIndicator>
  // Function to pick an image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your gallery to upload an image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  // Function to handle posting with text and optional image
  const handlePost = async () => {
   if (!postText.trim()) {
     Alert.alert("Error", "Post cannot be empty.");
     return;
   }

   let imageUrl = null;

   // If an image is provided, upload it to Cloudinary
   if (image) {
     try {
       // Upload image to Cloudinary
       imageUrl = await uploadImageToCloudinary(image); // This assumes you have the uploadImageToCloudinary function already
       if (!imageUrl) {
         Alert.alert("Error", "Image upload failed. Please try again.");
         return;
       }
     } catch (error) {
       console.error("Error uploading image:", error);
       Alert.alert("Error", "Error uploading image. Please try again.");
       return;
     }
   }

   try {
     const response = await axios.post(`${env.API_URL}/posts/create`, {'author':user._id, 'content':postText, image: imageUrl});

     if (response.status === 201) {
       setPostText(""); // Clear the post text
       setImage(null); // Clear the image
       setRefreshing(true);
     }
    } catch (error:any) {
     console.error("Error posting:", error);

     if (axios.isAxiosError(error) && error.response) {
       Alert.alert("Error", error.response?.data?.message || "Something went wrong.");
     } else if (error?.request) {
       Alert.alert("Error", "No response from server. Please try again.");
     } else {
       Alert.alert("Error", "Network error. Please try again.");
     }
   }finally{
     router.push('/')
     setLoading(false);
   }
 };


  // Function to remove the selected image
  const removeImage = () => {
    setImage(null);
  };

  return (
    <View className="p-4 border-b border-gray-300">
      <TextInput
        multiline
        numberOfLines={10}
        className="p-3 bg-gray-200 rounded-lg"
        placeholder="What's on your mind?"
        placeholderTextColor="#888"
        value={postText}
        onChangeText={setPostText}
      />

      {image && (
        <View className="flex-row items-center mt-3">
          {/* Image Preview */}
          <View className="relative w-16 h-16 rounded-lg overflow-hidden">
            <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
            {/* Cross Icon to remove image */}
            <TouchableOpacity onPress={removeImage} className="absolute top-0 right-0 p-1 bg-gray-600 rounded-full">
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View className="flex-row gap-3 mt-3">
        {/* Image Upload Button (without text) */}
        <TouchableOpacity onPress={pickImage} className="flex-row justify-center items-center bg-gray-300 p-3 rounded-md w-16 h-16">
          <Ionicons name="image" size={24} color="black" />
        </TouchableOpacity>

        {/* Post Button */}
        <TouchableOpacity onPress={handlePost} className="bg-blue-500 p-3 rounded-md flex-1 items-center">
          <Text className="text-white font-bold">Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}