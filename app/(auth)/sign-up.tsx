import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../../firebaseConfig"; // Import Firebase Storage
import { uploadImageToCloudinary } from "@/utils/cloudinaryUpload";

export default function SignUp() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

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
      if (error instanceof Error) {
        console.error("Upload failed:", error.message);
      } else {
        console.error("Upload failed:", error);
      }
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);
      
      let profilePic = "https://res.cloudinary.com/dax7yvopb/image/upload/v1738675080/bw6eijmj3vi2ppadpxyp.jpg";
      if (profileImage) {
        const result = await uploadImageToCloudinary(profileImage);
        profilePic = result.secure_url;
      }

      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, mobile, profilePic }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Account created successfully! Please Login.");
        router.push("/login");
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      Alert.alert("Sign-Up Error", (error as Error).message);
    } finally {
      setUploading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Profile Image Picker */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Image source={profileImage ? { uri: profileImage } : require("../../assets/images/user.png")} style={styles.profileImage} />
        <Text style={styles.imageText}>Upload Profile Image</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} autoCapitalize="words" />
      <TextInput style={styles.input} placeholder="Mobile Number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      {uploading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.push("./login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  imageText: {
    color: "#007BFF",
    marginTop: 5,
    fontSize: 16,
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#007BFF",
    fontSize: 16,
  },
});
