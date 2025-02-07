import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import images from "@/constants/images";
import { formatPostDate } from "@/utils/formattedDateTime";
import { renderDetails } from "@/utils/helper";
import axios from "axios";
import { env } from "@/constants/envValues";

const PostCard = ({ data, onPress, userOnPress, selfId }: { data: any, onPress?: () => void, userOnPress?: () => void, selfId: string }) => {


  const { _id, author, content, image, createdAt, comments, likes } = data;
  const [liked, setLiked] = useState(false);
  // setLiked(likes.find((id:any)=>(id==selfId)))
  // handle like
  const handleLike = async () => {
    try {
      setLiked(!liked);
      const response = await axios.post(`${env.API_URL}/posts/like/`, { 'postId': _id, 'userId': selfId });
      if (response.status == 200) console.log('great')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="bg-white p-4 my-2 rounded-2xl shadow-md">
        {/* Header */}
        <TouchableOpacity onPress={userOnPress}>
          <View className="flex-row items-center mb-3">
            <Image source={{ uri: author?.profilePic }} className="w-10 h-10 rounded-full mr-3" />
            <View>
              <Text className="text-base font-bold">{author?.name}</Text>
              <Text className="text-xs text-gray-500">{formatPostDate(createdAt)}</Text>
            </View>
          </View>
        </TouchableOpacity>


        <Text className="text-sm mb-3">{renderDetails(content)}</Text>
        {image ? <Image source={{ uri: image }} resizeMode='contain' className="w-full h-60 rounded-lg mb-3" /> : <View className="mb-5 mt-2"></View>}

        {/* Action Buttons */}
        <View className="flex-row justify-around mt-2">
          <TouchableOpacity onPress={() => { handleLike() }}>
            <View className="flex-row">
              <AntDesign name={liked ? "heart" : "hearto"} size={24} color={liked ? "red" : "black"} />
              <Text className="ml-2">{likes.length}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View className="flex-row">
              <Feather name="message-circle" size={24} color="black" />
              <Text className="text-sm ml-1">{comments.length}</Text></View>
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
