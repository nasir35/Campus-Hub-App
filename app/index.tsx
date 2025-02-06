import { Redirect, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig"; // Ensure correct path
import { onAuthStateChanged, User } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<null | User | undefined>(undefined); // Undefined to handle loading state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Show loading indicator while checking auth state
  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: 'orange', fontSize: 24, fontWeight: '600'}}>Welome To Campus Hub!</Text>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Redirect href="./login" />;
  }
  console.log(user)

  return <Redirect href={"./newsfeed"} />
}
