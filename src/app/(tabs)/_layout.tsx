import { Tabs } from 'expo-router'
import { View, Text } from 'react-native'

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{
        headerShown: false
    }}>
        <Tabs.Screen name='Home' />
        <Tabs.Screen name='MyBookings' />
    </Tabs>
  )
}

export default TabsLayout