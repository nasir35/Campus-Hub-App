import { View, Text } from 'react-native'
import React from 'react'
import UpcomingClass from '@/components/Upcoming'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClassAnnouncement from '@/components/Announcement'
import { FlatList } from 'react-native'
import Resource from '@/components/Resource'

const ViewBatch = () => {
  return (
    <SafeAreaView>
      <FlatList
        data = {[1, 2, 3, 4, 6,7]}
        renderItem={(item)=><View className='ml-5 mt-5'><Resource title= 'Red Black pdf sheet added' courseName='DSA' details = 'hello is this is the resouce http://www.google.com' images={['https://res.cloudinary.com/dax7yvopb/image/upload/v1729916014/mdnasir3-10:13:33-26-10-2024.png', 
        'https://res.cloudinary.com/dax7yvopb/image/upload/v1729916014/mdnasir3-10:13:33-26-10-2024.png', 'https://res.cloudinary.com/dax7yvopb/image/upload/v1729916014/mdnasir3-10:13:33-26-10-2024.png']}/></View>}
        
        ListHeaderComponent={()=>(
          <View>
            <View className='ml-5 mt-5 text-red-400'><Text className='font-bold text-xl '>Upcoming Class</Text></View>
            <FlatList 
              data = {[1, 2 ,3]}
              renderItem={({item})=>(<UpcomingClass course= 'DSA' teacher='notPirate' startTime='12:00'/>)}
              // keyExtractor={(item)=>item.$id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex gap-1"
              bounces={false} />
            <View className='ml-5 mt-5 text-red-400'><Text className='font-bold text-xl '>Announcemnts</Text></View>
            <FlatList 
              data = {[1, 2 ,3]}
              renderItem={({item})=>(<ClassAnnouncement topic='Islamic Seminar' time='12:00' from= '12 batch' 
            description='This will select the next occurrence of the word or text that you have selected. If you keep pressing the shortcut, it will keep selecting the next occurrences.'/>)}
              // keyExtractor={(item)=>item.$id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex gap-1"
              bounces={false} />
              <View className='ml-5'><Text className='font-bold text-xl'>Resources</Text></View>
          </View>
          
        )}/>
      <View className=''><Text className='font-bold text-xl'>Resources</Text></View>
    </SafeAreaView>
  )
}

export default ViewBatch