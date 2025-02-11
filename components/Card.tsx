import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import images from "@/constants/images";
import { formatPostDate } from "@/utils/formattedDateTime";
import { renderDetails } from "@/utils/helper";
import axios from "axios";
import { env } from "@/constants/envValues";

const PostCard = ({ data, onPress, userOnPress, selfId }: { data: any, onPress?: () => void, userOnPress?: () => void, selfId: string }) => {

  const { _id, author, content, image, createdAt, comments, likes } = data;
  const [liked, setLiked] = useState(false);

  // Handle like action
  const handleLike = async () => {
    try {
      setLiked(!liked);
      const response = await axios.post(`${env.API_URL}/posts/like/`, { 'postId': _id, 'userId': selfId });
      if (response.status == 200) console.log('great');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="bg-white p-5 mb-4 rounded-2xl shadow-lg mx-4">
        {/* Header */}
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity onPress={userOnPress} className="flex-row items-center gap-3">
            <Image source={{ uri: author?.profilePic }} className="w-12 h-12 rounded-full border-2 border-indigo-600" />
            <View>
              <Text className="text-lg font-bold text-gray-900">{author?.name}</Text>
              <Text className="text-xs text-gray-500">{formatPostDate(createdAt)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <Text className="text-base mb-4">{renderDetails(content)}</Text>
        {image ? (
          <Image source={{ uri: image }} resizeMode="contain" className="w-full h-60 rounded-lg mb-4" />
        ) : (
          <View className="mb-4" />
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-around mt-2">
          <TouchableOpacity onPress={handleLike} className="flex-row items-center gap-2 p-2 rounded-full hover:bg-indigo-100">
            <AntDesign name={liked ? "heart" : "hearto"} size={24} color={liked ? "red" : "gray"} />
            <Text className="text-sm text-gray-900">{likes.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onPress} className="flex-row items-center gap-2 p-2 rounded-full hover:bg-indigo-100">
            <Feather name="message-circle" size={24} color="gray" />
            <Text className="text-sm text-gray-900">{comments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-2 rounded-full hover:bg-indigo-100">
            <Feather name="share-2" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;
