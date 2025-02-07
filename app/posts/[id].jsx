import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Share, ActivityIndicator, Alert } from "react-native";
import { AntDesign, Feather, } from "@expo/vector-icons";
import { formatPostDate } from "@/utils/formattedDateTime";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { env } from "@/constants/envValues";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { renderDetails } from "@/utils/helper";
import axios from "axios";

const PostDetailCard = () => {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${env.API_URL}/posts/${id}`);
        const data = await response.json();
        if (data.success) {
          setEditedContent(data.data.content);
          setPost(data.data);
          setComments(data.data.comments || []); // Initialize comments correctly
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);


  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" className="text-primary-300 mt-5" />
      </View>
    );
  // destructing 
  const { author, content, image, createdAt } = post;

  //handle post editing 
  const handleUpdatePost = async () => {
    try {
      const response = await axios.patch(`${env.API_URL}/posts/update/${id}`, { 'userId': author._id, 'update':{'content':editedContent}});
      if (response.status === 200) {
        setPost({ ...post, content: editedContent });
        setEditing(false);
        Alert.alert("Success", "Post updated successfully");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };


  // handle comment
  const handleCommentSubmit = async () => {
    try {
      if (comment.trim()) {
      const response = await axios.post(`${env.API_URL}/posts/comment/${id}`, { 'user': author._id, 'text': comment });
      if (response.status === 201) {
        Alert.alert('sucess')
      
          const newComment = { id: Date.now().toString(), text: comment };
          setComments([...comments, newComment]); // Update comments correctly
          setComment("");
        }
      }
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  // handle share
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Author: ${author?.name} \n post: ${content}`
      });
    } catch (error) {
      console.error("Error sharing post: ", error);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mt-3 p-2 bg-gray-100 rounded-md">
              <Text></Text>
              <Text className="text-sm">{renderDetails(item.text)}</Text>
            </View>
          )}
        ListHeaderComponent={()=>(
        <View>
        <View className="flex-row items-center bg-white p-3 rounded-lg shadow-md mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={30} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold flex-1 text-center">Post Details</Text>
        </View>

        <View className="bg-white p-4 my-2 rounded-2xl shadow-md">
          {/* Author */}
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Image source={{ uri: author?.profilePic }} className="w-10 h-10 rounded-full mr-3" />
              <View>
                <Text className="text-base font-bold">{author?.name}</Text>
                <Text className="text-xs text-gray-500">{formatPostDate(createdAt)}</Text>
              </View>
            </View>
            {editing ? (
              <View className="flex-row ">
                <TouchableOpacity onPress={()=>setEditing(false)} className=" bg-blue-500 p-2 rounded-lg">
                  <Text className="text-white text-center">Discard</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpdatePost} className="ml-5 bg-blue-500 p-2 rounded-lg">
                  <Text className="text-white text-center">Save</Text>
                </TouchableOpacity>
              </View>

            ) : (
              <TouchableOpacity onPress={() => setEditing(true)} className="bg-gray-300 p-2 rounded-lg">
                <Text className="text-black text-center">Edit</Text>
              </TouchableOpacity>
            )}
          </View>



          {/* Content */}
          {editing ? (
            <TextInput
              value={editedContent}
              onChangeText={setEditedContent}
              className="border p-2 rounded-lg mb-3"
              multiline
            />
          ) : (
            <Text className="text-sm mb-3">{renderDetails(content)}</Text>
          )}
          {/* Image */}
          {image && <Image source={{ uri: image }} resizeMode="contain" className="w-full h-60 rounded-lg mb-3" />}

          {/* Actions */}
          <View className="flex-row justify-around mt-2">
            <TouchableOpacity onPress={() => setLiked(!liked)}>
              <AntDesign name={liked ? "heart" : "hearto"} size={24} color={liked ? "red" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="message-circle" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
              <Feather name="share-2" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Comment Input */}
          <View className="flex-row items-center mt-3 border rounded-lg p-2 border-gray-300">
            <TextInput
              placeholder="Write a comment..."
              value={comment}
              onChangeText={setComment}
              className="flex-1 text-sm"
            />
            <TouchableOpacity onPress={handleCommentSubmit} className="ml-2">
              <AntDesign name="arrowright" size={24} color="blue" />
            </TouchableOpacity>
          </View>
        </View>
      </View>)}/>
    </SafeAreaView>
  );
};
export default PostDetailCard;
