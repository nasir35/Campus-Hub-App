import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@/app/context/authContext";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Use `setTimeout` to ensure RootLayout is mounted before navigating
      setTimeout(() => {
        router.replace(user ? "/newsfeed" : "/login");
      }, 500);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "orange", fontSize: 24, fontWeight: "600" }}>Welcome to Campus Hub!</Text>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return null;
}
