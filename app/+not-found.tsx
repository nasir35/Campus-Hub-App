import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const NotFoundScreen = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" }}>
      <Image
        source={{ uri: "https://i.imgur.com/qIufhof.png" }} // Example illustration
        style={{ width: 250, height: 250, marginBottom: 20 }}
      />
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Oops! Page not found</Text>
      <Text style={{ fontSize: 16, color: "#6c757d", textAlign: "center", marginBottom: 20 }}>The page you are looking for might have been removed or does not exist.</Text>
      <TouchableOpacity onPress={() => router.push("/")} style={{ backgroundColor: "#007bff", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
        <Text style={{ color: "white", fontSize: 16 }}>Go Back Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotFoundScreen;
