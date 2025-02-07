import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/authContext";

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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("./sign-up")}>
                  <Text style={styles.link}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", height: 50, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#007BFF", padding: 12, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18 },
  link: {
    marginTop: 15,
    color: "#007BFF",
    fontSize: 16,
  },
});
