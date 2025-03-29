import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1f2937",
          height: 70,
          borderRadius: 35,
          paddingBottom: 10,
          paddingTop: 10,
          marginBottom: 16, 
          marginHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="MyBookings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="book" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="user-alt" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

const TabIcon = ({ name, color, focused }: { name: string, color: string, focused: boolean }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        backgroundColor: focused ? "rgba(0, 120, 240, 0.2)" : "transparent",
        borderRadius: 25,
      }}
    >
      <FontAwesome5
        name={name}
        size={24} 
        color={focused ? "#0078F0" : "#fff"}
      />
    </View>
  );
};

export default TabsLayout;
