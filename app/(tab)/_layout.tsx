import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (

      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="newsfeed"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesome5 name="newspaper" size={24} color={focused ? "#007BFF" : "#aaa"} />,
        }}
      />
      <Tabs.Screen
        name="batch"
        options={{
          tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="account-group" size={28} color={focused ? "#007BFF" : "#aaa"} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => <Ionicons name="chatbubble-ellipses" size={24} color={focused ? "#007BFF" : "#aaa"} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <FontAwesome5 name="user" size={24} color={focused ? "#007BFF" : "#aaa"} />,
        }}
      />
    </Tabs>
    
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    height: 50,
  },
});
