import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { useAuth } from "../context/authContext";

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  if (loading) return <ActivityIndicator size="large" color="#007BFF" />;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image source={{ uri: userData?.profilePic }} style={{ width: 100, height: 100, borderRadius: 50 }} />
      <Text>Name: {userData?.name}</Text>
      <Text>Email: {userData?.email}</Text>
      <Text>Mobile: {userData?.mobile}</Text>
    </View>
  );
}
