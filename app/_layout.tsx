import { AuthProvider, useAuth } from "@/app/context/authContext";
import { Stack, Slot } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import "@/global.css";

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <AuthCheck />
      </AuthProvider>
      <Toast />
    </>
  );
}

function AuthCheck() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tab)" />
    </Stack>
  );
}
