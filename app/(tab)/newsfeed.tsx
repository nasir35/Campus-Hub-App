import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, Modal} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import PostCard from "@/components/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import { env } from "@/constants/envValues";


export default function Newsfeed() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();

  const toggleTheme = () => setColorScheme(colorScheme === "dark" ? "light" : "dark");


  const [posts, setPosts]:any = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${env.API_URL}/posts`);
        const data = await response.json();
        if (data.success) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);
  if (loading) return <View><Text>nothing is here</Text></View>
  // console.log(posts[0]._id)
  return (
    <SafeAreaView>
      <FlatList
          data={posts}
          renderItem={({ item}) =>(console.log('item', item),  <View className="mt-5">
            <PostCard data = { item }
            // _id = {item?._id} name = "{item?.userId.name}" content = {item.content} image = {item.image} likes = {item.likes} comments={item.comments}
             /></View>)}
            // keyExtractor={(item)=>item._id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={()=>(
        
      <View className={colorScheme === "dark" ? "bg-black" : "bg-white"}>
        {/* Top Bar */}
        <View className="flex-row justify-between p-4 bg-gray-100">
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Text className="font-bold text-xl">CampusHub</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-5 ">
            <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
              <Feather name="search" size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {searchVisible && (
          <View className="flex-row items-center p-3 bg-gray-200">
            <TextInput className="flex-1 p-2 bg-white rounded-md" placeholder="Search..." placeholderTextColor="#888" />
            <TouchableOpacity>
              <MaterialIcons name="filter-list" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        )}

        {/* Posting Block */}
        <View className="p-4 border-b border-gray-300">
          <TextInput className="p-3 bg-gray-200 rounded-lg" placeholder="What's on your mind?" placeholderTextColor="#888" />
          <TouchableOpacity className="bg-blue-500 p-3 rounded-md items-center mt-3">
            <Text className="text-white font-bold text-lg">Post</Text>
          </TouchableOpacity>
        </View>

        {/* Newsfeed */}
        
      </View>
  )}/>
  </SafeAreaView>
);}
