import { Stack } from 'expo-router';

const BookingsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Booking"
        options={{
          headerShown: true,
          title: 'Booking Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="EditBooking"
        options={{
          headerShown: true,
          title: 'Edit Booking',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
};

export default BookingsLayout;
