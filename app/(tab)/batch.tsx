import { View, Text } from 'react-native'
import React from 'react'
import UpcomingClass from '@/components/Upcoming'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClassAnnouncement from '@/components/Announcement'
import { FlatList } from 'react-native'
import Resource from '@/components/Resource'

const Batch = () => {
  return (
    <SafeAreaView>
      <FlatList
        data = {[1, 2, 3]}
        renderItem={(item)=><Resource title= 'Red Black pdf sheet added' courseName='DSA' images={['https://www.pinterest.com/pin/68748317492/', 'https://www.pinterest.com/pin/68748317492/']}/>}
        
        ListHeaderComponent={()=>(
          <View>
          <UpcomingClass course= 'lorem' teacher='notPirate' startTime='12:00'/>
          <ClassAnnouncement topic='Islamic Seminar' time='12:00' from= '12 batch' 
            description='This will select the next occurrence of the word or text that you have selected. If you keep pressing the shortcut, it will keep selecting the next occurrences.'/>
          </View>
        )}/>
      
    </SafeAreaView>
  )
}

export default Batch