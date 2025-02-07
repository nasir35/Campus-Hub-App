import React from 'react';
import { View, Text } from 'react-native';

const ClassAnnouncement = ({ topic, from, description, time }: { topic: string, from: string, description: string, time: string }) => {
  return (
    <View className="mt-5 w-72 p-5 bg-white rounded-2xl shadow-lg border border-gray-200 mx-2">
        {/* Topic Header */}
        <Text className="text-xl font-bold text-gray-900">{topic}</Text>
        
        {/* Divider */}
        <View className="h-[2px] bg-gray-200 my-3" />

        {/* Announcement Details */}
        <Text className="text-sm text-gray-700 font-medium">📢 From: {from}</Text>
        <Text className="text-sm text-gray-700 font-medium">⏰ Time: {time}</Text>

        {/* Description Section */}
        <Text className="text-base text-gray-800 mt-3 leading-relaxed">{description}</Text>
      </View>
  );
};

export default ClassAnnouncement;
