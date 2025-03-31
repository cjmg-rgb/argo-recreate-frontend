
import { Stack } from 'expo-router'

const BookingsLayout = () => {
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name='Booking' 
            options={{
                headerShown: true,
                title: "Booking",
                headerBackTitle: "Back"
            }}
        />
    </Stack>
  )
}

export default BookingsLayout