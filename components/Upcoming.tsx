import React from 'react';
import { View, Text } from 'react-native';

const UpcomingClass = ({ course, teacher, startTime }: { course: string, teacher: string, startTime: string }) => {
  return (
    <View className="p-5 m-4 bg-white rounded-2xl shadow-lg border border-gray-200">
      <Text className="text-2xl font-bold text-gray-900">{course}</Text>
      <View className="h-[2px] bg-gray-200 my-2" />
      <Text className="text-sm text-gray-700 font-medium">👨‍🏫 Teacher: {teacher}</Text>
      <Text className="text-sm text-gray-700 font-medium">⏰ Start Time: {startTime}</Text>
    </View>

  );
};

export default UpcomingClass;
