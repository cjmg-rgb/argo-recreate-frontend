import React from 'react';
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { Appbar, Card, Avatar, Button, IconButton, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetUserBookings } from '~/hooks/booking/useGetUserBookings';
import useAuthStore from '~/store/useAuthStore';
import { IBooking } from '~/utils/types';
import { format } from 'date-fns';
import moment from 'moment';
import { useRouter, Link } from 'expo-router';
import { useBookingStore } from '~/store/useBookingStore';
import { useAddBookingStore } from '~/store/useModalStore';
import BookACar from '~/components/common/BookACar';

const BookingScreen = () => {
  const { data: bookings } = useGetUserBookings();
  const { auth } = useAuthStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const { setBooking } = useBookingStore();
  const router = useRouter();
  const { toggleModal, openModal } = useAddBookingStore();

  // const sortedBookings = React.useMemo(() => {
  //   return bookings?.bookings.sort((a: IBooking, b: IBooking) => {
  //     const dateA = new Date(a.date).getTime();
  //     const dateB = new Date(b.date).getTime();

  //     // Ascending or Descending order
  //     if (sortDirection === 'asc') {
  //       return dateA - dateB; // Ascending
  //     }
  //     return dateB - dateA; // Descending
  //   });
  // }, [bookings, sortDirection]);

  const renderItem = (item: IBooking) => {
    const formattedDate = format(item.date, 'MMM dd, y');
    const status = moment(new Date()).isBefore(item.date) ? 'Upcoming' : 'Ongoing';

    return (
      <TouchableOpacity>
        <Card
          className="mx-4 mb-4 rounded-xl"
          mode="contained"
          style={{
            backgroundColor: '#f3f4f6',
            overflow: 'hidden',
            elevation: 0,
            shadowColor: 'transparent',
          }}>
          <Card.Title
            title={item.title}
            subtitle={`${status} - ${formattedDate}`}
            left={(props) => (
              <Avatar.Icon {...props} icon="calendar" style={{ backgroundColor: '#4f46e5' }} />
            )}
            subtitleStyle={{
              color: 'green',
            }}
            titleStyle={{}}
          />
          <Card.Content>
            <Text className="mb-2 text-gray-600">{item.instruction}</Text>
            <Button
              icon="chevron-right"
              className="self-end"
              textColor="#4f46e5"
              onPress={() => {
                setBooking(item);
                router.push('/bookings/Booking');
              }}>
              View Details
            </Button>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <View className="rounded-b-3xl bg-[#1f2937] p-6 shadow-lg">
        <View className="flex-row items-center">
          <Avatar.Image size={70} source={require('@/assets/images/logo.png')} className="mr-4" />
          <View>
            <Text className="text-xl font-semibold text-white">Welcome Back, {auth?.name}!</Text>
            <Text className="text-sm text-gray-500">{auth?.id}</Text>
            <Text className="text-sm text-blue-200">Ready for your next adventure?</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 gap-4 p-4">
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{
            borderColor: '#1f2937',
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        />

        <Button
          icon="car"
          mode="outlined"
          buttonColor="#0078F0"
          textColor="#ffffff"
          onPress={toggleModal}
          className="px-4 py-2">
          Book A Car
        </Button>

        {openModal && <BookACar />}

        <FlatList
          data={bookings?.bookings.sort(
            (a: IBooking, b: IBooking) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 60, gap: 10 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;
