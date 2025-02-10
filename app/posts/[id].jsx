import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Share, ActivityIndicator, Alert } from "react-native";
import { AntDesign, Feather, } from "@expo/vector-icons";
import { formatPostDate } from "@/utils/formattedDateTime";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { env } from "@/constants/envValues";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router'
import { renderDetails } from "@/utils/helper";
import axios from "axios";
import { useAuth } from "../context/authContext";

const PostDetailCard = () => {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeList, setlikeList] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [loading2, setLoading2] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${env.API_URL}/posts/${id}`);
      const data = await response.json();
      if (data.success) {
        setEditedContent(data.data.content);
        setPost(data.data);
        setComments(data.data.comments || []);
        const isLiked = data.data.likes.find((id) => (id == auth.user._id));
        setLiked(isLiked)
        setlikeList(data.data.likes)
        console.log(likeList);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const auth = useAuth()
  const handleUserPress = (id) => { id == auth.user._id ? router.push('/(tab)/profile') : router.push(`../profiles/${id}`) }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${env.API_URL}/posts/${id}`);
        const data = await response.json();
        if (data.success) {
          setEditedContent(data.data.content);
          setPost(data.data);
          setComments(data.data.comments || []);
          const isLiked = data.data.likes.find((id) => (id == auth.user._id));
          setLiked(isLiked)
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
  const { _id, author, content, image, createdAt } = post;

  //handle post editing 
  const handleUpdatePost = async () => {
    try {
      const response = await axios.patch(`${env.API_URL}/posts/update/${id}`, { 'userId': author._id, 'update': { 'content': editedContent } });
      if (response.status === 200) {
        setPost({ ...post, content: editedContent });
        setEditing(false);
        Alert.alert("Success", "Post updated successfully");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

   // handle post delete 
  const handlePostDelete = async () => {
    try {
      const response = await axios.delete(`${env.API_URL}/posts/delete/${id}`, {
        headers: {
          'authorId': author._id,
          'userId': auth.user._id
        }
      });
      if (response.status === 200) {
        Alert("Post Deleted Sucessfully");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  // handle like
  const handleLike = async () => {
    try {
      setLiked(!liked);
      const response = await axios.post(`${env.API_URL}/posts/like/`, { 'postId': _id, 'userId': auth.user._id });
      if (response.status = 200) console.log("liked done")
      fetchPosts();
    } catch (error) {
      console.log(error)
    }
  }

  // handle comment
  const handleCommentSubmit = async () => {
    try {
      if (comment.trim()) {
        const response = await axios.post(`${env.API_URL}/posts/comment/${id}`, { 'user': auth.user._id, 'text': comment });
        if (response.status === 201) {
          const newComment = { createdAt: Date.now().toString(), text: comment };
          // setComments([...comments, newComment]);
          setComment("");
          fetchPosts();
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
    <SafeAreaView className="h-full p-2">
      <FlatList
        data={comments}
        // keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mt-3 bg-gray-100 rounded-md p-2 pb-5">

            {/* TODO: add user id in the comment api */}
            <TouchableOpacity onPress={() => (handleUserPress(item.user._id))}>
              <View className="flex-row gap-2 ml-2 items-center">
                <Image
                  source={{ uri: item.user.profilePic }}
                  className="w-8 h-8 rounded-full"
                />
                <View>
                  <Text className="text-sm font-bold">{item.user.name}</Text>
                  <Text className="text-xs text-gray-600">{formatPostDate(item.createdAt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Text className="text-sm ml-2">{renderDetails(item.text)}</Text>
          </View>

        )}
        ListHeaderComponent={
          <View>
            <View className="flex-row items-center bg-white p-3 rounded-lg shadow-md mb-4">
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={30} color="black" />
              </TouchableOpacity>
              <Text className="text-lg font-bold flex-1 text-center">Post Details</Text>
            </View>

            <View className="bg-white p-4 rounded-2xl shadow-md">
              {/* Author */}
              <View className="flex-row items-center justify-between mb-3">
                <TouchableOpacity onPress={() => handleUserPress(author._id)}>
                  <View className="flex-row items-center mb-3">
                    <Image source={{ uri: author?.profilePic }} className="w-10 h-10 rounded-full mr-3" />
                    <View>
                      <Text className="text-base font-bold">{author?.name}</Text>
                      <Text className="text-xs text-gray-500">{formatPostDate(createdAt)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {author._id === auth.user._id || auth.user.role == 'Admin' ? (
                  editing ? (
                    <View className="flex-row">
                      <TouchableOpacity
                        onPress={() => setEditing(false)}
                        className="bg-blue-500 p-2 rounded-lg"
                      >
                        <Text className="text-white text-center">Discard</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleUpdatePost}
                        className="ml-5 bg-blue-500 p-2 rounded-lg"
                      >
                        <Text className="text-white text-center">Save</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="flex-row gap-5 mb-4"><TouchableOpacity
                      onPress={() => setEditing(true)}
                      className="bg-gray-300 p-2 rounded-lg flex items-center justify-center"
                    >
                      <FontAwesome5 name="edit" size={20} color="black" />
                    </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handlePostDelete}
                        className="bg-red-500 p-2 rounded-lg flex items-center justify-center"
                      >
                        <FontAwesome5 name="trash" size={20} color="white" />
                      </TouchableOpacity></View>
                  )
                ) : (
                  <View />
                )}
              </View>



              {/* Content */}
              {editing && (author._id == auth.user._id || auth.user.role == 'Admin') ? (
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
                <TouchableOpacity onPress={() => { handleLike() }}>
                  <View className="flex-row">
                    <AntDesign name={liked ? "heart" : "hearto"} size={24} color={liked ? "red" : "black"} />
                    <Text className="ml-2">{post.likes.length}</Text>
                  </View>

                </TouchableOpacity>
                <TouchableOpacity>
                  <View className="flex-row">
                    <Feather name="message-circle" size={24} color="black" />
                    <Text className="text-sm ml-1">{comments.length}</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare}>
                  <Feather name="share-2" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>} />
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
    </SafeAreaView>
  );
};
export default PostDetailCard;
