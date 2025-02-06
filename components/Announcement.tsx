import React from 'react';
import { View, Text } from 'react-native';

const ClassAnnouncement = ({ topic, from, description, time }: {topic:string, from:string, description:string, time:string}) => {
      return (
        <View className="p-4 m-4 bg-white rounded-lg shadow-md">
          <Text className="text-xl font-bold text-gray-800">{topic}</Text>
          <Text className="text-sm text-gray-600 mt-1">From: {from}</Text>
          <Text className="text-sm text-gray-600 mt-1">Time: {time}</Text>
          <Text className="text-base text-gray-700 mt-2">{description}</Text>
        </View>
      );
    };
    
    export default ClassAnnouncement;
    
