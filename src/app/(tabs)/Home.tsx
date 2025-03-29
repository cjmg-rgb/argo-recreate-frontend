import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useLogout } from '~/hooks/auth/useLogout'
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {

  const { mutate: logout } = useLogout();

  return (
    <SafeAreaView>
      <View>
        <Text>Home</Text>
        <Pressable onPress={() => logout()}>
          <Text>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Home