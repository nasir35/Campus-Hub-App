import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';

const Resource = ({ title, courseName, details, images = [] }: { title: string, courseName: string, details: string, images: string[] }) => {
  const renderDetails = (text: string) => {
    const words = text.split(/(https?:\/\/\S+|www\.\S+)/g); // Split by URLs including www links
    return words.map((word, index) => {
      if (word.match(/https?:\/\/\S+/) || word.match(/www\.\S+/)) {
        const link = word.startsWith("www.") ? `https://${word}` : word;
        return (
          <Text
            key={index}
            className="text-blue-500 underline"
            onPress={() => Linking.openURL(link)}
          >
            {word}
          </Text>
        );
      }
      return <Text key={index} className="text-gray-700">{word}</Text>;
    });
  };

  return (
    <View className="p-5 rounded-2xl border border-gray-300 bg-white shadow-lg mx-4 my-2">
      {/* Title and Course Name */}
      <Text className="text-xl font-bold text-gray-900 mb-1">{title}</Text>
      <Text className="text-base text-gray-700 mb-3">{courseName}</Text>

      {/* Details */}
      <Text className="text-base text-gray-700 mb-3 flex-row flex-wrap">{renderDetails(details)}</Text>

      {/* Image Gallery */}
      <View className="flex-row flex-wrap">
        {images.length > 0 ? (
          images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(image)}>
              <Image
                source={{ uri: image }}
                className="w-36 h-36 mr-2 mb-2 rounded-lg border border-gray-200"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-gray-500">No images available</Text>
        )}
      </View>
    </View>
  );
};

export default Resource;
