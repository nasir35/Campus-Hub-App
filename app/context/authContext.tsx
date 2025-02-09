import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { env } from "@/constants/envValues";
import { Alert } from "react-native";
import { Redirect, router } from "expo-router";
import Toast from "react-native-toast-message";

// Define types
interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (name:string, email: string, password: string, mobile:string, profilePic?:string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  token: string;
  setUser:any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string>("");

  // Check if user is already logged in
 useEffect(() => {
   const loadUser = async () => {
     setIsLoading(true);
     const storedToken = await AsyncStorage.getItem("token");

     if (!storedToken) {
       setIsLoading(false);
       return;
     }

     setToken(storedToken);
     axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

     try {
       const response = await axios.get(`${env.API_URL}/users/me`);
       setUser(response.data.data);
      //  console.log("token : ", storedToken, "user: ", response.data.data)
     } catch (error: any) {
       console.log("Auto-login failed:", error);
       await AsyncStorage.removeItem("token");
       setToken("");
       delete axios.defaults.headers.common["Authorization"];

       if (error.response?.status === 401) {
         Alert.alert("Session Expired", "Please log in again.");
         router.push("/(auth)/login");
       }
     } finally {
       setIsLoading(false);
     }
   };

   loadUser();
 }, [token]);


    
    const register = async (name: string, email: string, password: string, mobile: string, profilePic?: string) => {
      try {
        setIsLoading(true);
        const response = await axios.post(`${env.API_URL}/users/register`, {
          name,
          email,
          password,
          mobile,
          profilePic,
        });

        const { token, user } = response.data.data;

        // Store token locally
        await AsyncStorage.setItem("token", token);
        setToken(token);
        setUser(user);
        Toast.show({
          type: "success",
          text1: "Registration successful",
          text2: "You have Registered successfully!",
        });
        
      } catch (error:any) {
        console.error("Registration error:", error);
        Alert.alert("Error", error.response?.data?.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };


  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${env.API_URL}/users/login`, { email, password });
      const { token, user } = response.data.data;

      await AsyncStorage.setItem("token", token);
      setUser(user);
      setToken(token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };


  // Logout function
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setToken("");
    delete axios.defaults.headers.common["Authorization"];
    setTimeout(() => {
      router.replace("/(auth)/login"); // Use replace instead of push
    }, 100); // Small delay allows layout to mount

    // Show toast after navigating
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been logged out successfully!",
      });
    }, 2000);
  };

  return <AuthContext.Provider value={{ user, register, login, logout, setUser, isLoading, token }}>{children}</AuthContext.Provider>;
};

// Hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
