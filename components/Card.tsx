import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import images from "@/constants/images";
import { formatPostDate } from "@/utils/formattedDateTime";
import { renderDetails } from "@/utils/helper";

const PostCard = ({data, onPress}:{data:any, onPress?:()=>void})=>{
  
  const { author, content, image, createdAt } = data;
  const [liked, setLiked] = useState(false);
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="bg-white p-4 my-2 rounded-2xl shadow-md">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          <Image source={{ uri: author?.profilePic }} className="w-10 h-10 rounded-full mr-3" />
          <View>
            <Text className="text-base font-bold">{author?.name}</Text>
            <Text className="text-xs text-gray-500">{formatPostDate(createdAt)}</Text>
          </View>
        </View>

        <Text className="text-sm mb-3">{renderDetails(content)}</Text>
        {image ? <Image source={{ uri: image }} resizeMode = 'contain' className="w-full h-60 rounded-lg mb-3" />:<View className="mb-5 mt-2"></View>}

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
    </TouchableOpacity>
  );
};

export default PostCard;
