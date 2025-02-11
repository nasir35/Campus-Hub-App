import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/authContext";
import { uploadImageToCloudinary } from "@/utils/cloudinaryUpload";
import images from '@/constants/images'
import { Feather } from "@expo/vector-icons";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error("Permission to access the gallery was denied");
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.canceled) return null;
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !name || !mobile) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setUploading(true);
    try {
      let profilePic = "https://res.cloudinary.com/dax7yvopb/image/upload/v1738675080/bw6eijmj3vi2ppadpxyp.jpg";
      if (profileImage) {
        const url = await uploadImageToCloudinary(profileImage);
        profilePic = url;
      }

      await auth.register(name, email, password, mobile, profilePic);
      router.push("/login"); // Redirect to login after successful sign up
    } catch (error) {
      Alert.alert("Sign-Up Error", (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-5 py-8">
      <Text className="text-indigo-600 text-2xl font-semibold mb-8">Create an Account</Text>

      {/* Profile Image Picker */}
      <TouchableOpacity onPress={pickImage} className="flex justify-center items-center mb-6">
        <View className="relative">
          {/* Profile Image */}
          <Image
            source={profileImage ? { uri: profileImage } : require("../../assets/images/user.png")}
            className="w-32 h-32 rounded-full border-4 border-indigo-600"
          />
        </View>

        {/* Upload Icon */}
        <Feather name="upload" size={28} color="#4F46E5" className="mt-3" />

        {/* Tap to Upload Button */}
        <View className="bg-indigo-600 px-4 py-2 mt-2 rounded-lg shadow-md">
          <Text className="text-white text-lg font-semibold">Tap to Upload</Text>
        </View>
      </TouchableOpacity>



      {/* Input Fields */}
      <TextInput
        className="w-full p-3 mb-4 border-2 border-indigo-600 rounded-lg text-lg"
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        className="w-full p-3 mb-4 border-2 border-indigo-600 rounded-lg text-lg"
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <TextInput
        className="w-full p-3 mb-4 border-2 border-indigo-600 rounded-lg text-lg"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full p-3 mb-6 border-2 border-indigo-600 rounded-lg text-lg"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Sign Up Button */}
      {uploading ? (
        <ActivityIndicator size="large" color="#6366F1" />
      ) : (
        <TouchableOpacity
          onPress={handleSignUp}
          className="w-full py-4 bg-indigo-600 rounded-lg mb-4"
        >
          <Text className="text-white text-center text-lg font-semibold">Sign Up</Text>
        </TouchableOpacity>
      )}

      {/* Already have an account? Link */}
      <TouchableOpacity onPress={() => router.push("./login")} className="mt-4">
        <Text className="text-indigo-600 text-lg font-semibold">
          Already have an account? <Text className="underline">Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
