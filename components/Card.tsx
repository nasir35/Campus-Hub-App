import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import image from "@/constants/images";
import { formatPostDate } from "@/utils/formattedDateTime";

// const PostCard = ({ profilePic, username, time, content, postImage }:
//     {profilePic:any, username:string, time:string, content:string, postImage:any}) => {
  // {_id, name, content, image, likes, comments}:
  // {_id:any, name:any, content:any, image:any, likes:any[], comments:any[]}
const PostCard = ({data}:{data:any})=>{

  const { author, content, image, createdAt } = data;
    const postImage = 1;
  const [liked, setLiked] = useState(false);
  return (
    <View className="bg-white p-4 my-2 rounded-2xl shadow-md">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Image source={{ uri: author?.profilePic }} className="w-10 h-10 rounded-full mr-3" />
        <View>
          <Text className="text-base font-bold">{author?.name}</Text>
          <Text className="text-xs text-gray-500">{formatPostDate(createdAt)}</Text>
        </View>
      </View>

      {/* Content */}
      <Text className="text-sm mb-3">{content}</Text>

      {/* Optional Photo Display */}
      {postImage && <Image source={{ uri: image }} className="w-full h-60 rounded-lg mb-3" />}

      {/* Action Buttons */}
      <View className="flex-row justify-around mt-2">
        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <AntDesign name={liked ? "heart" : "hearto"} size={24} color={liked ? "red" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="message-circle" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="share-2" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;
