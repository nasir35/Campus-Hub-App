import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'

const ViewBatch = () => {
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header (Fixed at the Top) */}
      <View className="flex-row  items-center bg-white p-3 rounded-lg shadow-md">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold flex-1 text-center">CSE 5th</Text>
      </View>

      
    </SafeAreaView>
  )
}

export default ViewBatch