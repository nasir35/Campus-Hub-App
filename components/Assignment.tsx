import React from 'react';
import { View, Text } from 'react-native';

const Assignment = ({ title, courseName, teacher, deadline, description }:
    {title:string, courseName:string, teacher:string, deadline:string, description:string}) => {
  return (
    <View className="p-5 rounded-lg border border-gray-300 bg-white mb-5">
      <Text className="text-xl font-bold mb-2">{title}</Text>
      <Text className="text-lg text-gray-600 mb-1">{courseName}</Text>
      <Text className="text-base text-gray-500 mb-3">{teacher}</Text>
      <Text className="text-sm text-gray-400 mb-3">{`Deadline: ${deadline}`}</Text>
      <Text className="text-base text-gray-700">{description}</Text>
    </View>
  );
};

export default Assignment;
