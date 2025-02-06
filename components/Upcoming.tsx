import React from 'react';
import { View, Text } from 'react-native';

const UpcomingClass = ({ course, teacher, startTime }:{course:string, teacher:string, startTime:string}) => {
  return (
    <View className="p-4 m-4 bg-gray-100 rounded-lg shadow-md">
      <Text className="text-2xl font-bold text-gray-800">{course}</Text>
      <Text className="text-sm text-gray-600 mt-1">Teacher: {teacher}</Text>
      <Text className="text-sm text-gray-600 mt-1">Start Time: {startTime}</Text>
    </View>
  );
};

export default UpcomingClass;
