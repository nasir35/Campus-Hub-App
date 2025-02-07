import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { env } from "@/constants/envValues";
import PostCard from "@/components/Card";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import PostInput from "@/components/PostInput";
import axios from "axios";
import {useAuth} from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Newsfeed() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [posts, setPosts]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const postsRes  = await axios.get(`${env.API_URL}/posts`);
        if (postsRes.status === 200) { 
          setPosts(postsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  

  const handlePress = (id:string) => router.push(`/posts/${id}`)

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );

  return (
    <SafeAreaView className="flex-1">
      {/* Header Component */}
      <Header toggleSearch={() => setSearchVisible(!searchVisible)} />

      {/* Search Bar Component (Visible when toggled) */}
      {searchVisible && <SearchBar />}

      {/* Post Input Component */}
      <PostInput />

      {/* Newsfeed List */}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View className="mt-5">
            <PostCard data={item} onPress={()=>{handlePress(item._id)}} />
          </View>
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
