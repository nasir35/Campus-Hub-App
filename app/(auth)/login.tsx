import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/authContext";
import images from "@/constants/images"
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const auth = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const res = await auth.login(email, password);
      console.log(res);
      router.replace("/"); // Redirect to home after login
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 p-4">
      <Image
        source={images.camp} // Add your logo image
        style={{ width: 140, height: 120, marginBottom: 30 }}
      />
      <Text className="text-indigo-600 text-4xl font-bold mb-6">Login</Text>

      <TextInput
        style={{ width: "90%", height: 50 }}
        className="border border-indigo-500 rounded-lg p-3 mb-4 text-lg text-gray-700"
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={{ width: "90%", height: 50 }}
        className="border border-indigo-500 rounded-lg p-3 mb-6 text-lg text-gray-700"
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-indigo-600 py-3 px-6 rounded-full mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-xl font-semibold">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./sign-up")} className="flex-row items-center justify-center space-x-2 mt-4">
        <Text className="text-indigo-600 text-lg font-semibold">
          Don't have an account?{" "}
        </Text>
        <Text className="text-indigo-600 text-lg font-semibold underline">
          Sign Up
        </Text>
        <Ionicons name="arrow-forward-circle" size={24} color="#5C6AC4" />
      </TouchableOpacity>
    </View>
  );
}
