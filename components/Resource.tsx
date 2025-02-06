import React from 'react';
import { View, Text, Image } from 'react-native';

const Resource = ({ title, courseName, images = [] }:{title:string, courseName:string, images:any[]}) => {
  return (
    <View className="p-5 rounded-lg border border-gray-300 bg-white mb-5">
      <Text className="text-lg font-bold mb-2">{title}</Text>
      <Text className="text-base mb-3">{courseName}</Text>
      <View className="flex-row flex-wrap">
        {images.length > 0 ? (
          images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              className="w-24 h-24 mr-2 mb-2 rounded-lg"
            />
          ))
        ) : (
          <Text>No images available</Text>
        )}
      </View>
    </View>
  );
};

export default Resource;
