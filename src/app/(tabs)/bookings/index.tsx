import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Appbar, Card, Avatar, Button, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetUserBookings } from '~/hooks/booking/useGetUserBookings';
import useAuthStore from '~/store/useAuthStore';
import { IBooking } from '~/utils/types';
import { format } from 'date-fns';
import moment from 'moment';
import { useRouter } from 'expo-router';
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

  const renderItem = (item: IBooking) => {
    const formattedDate = format(item.date, 'MMM dd, y');
    const status = moment(new Date()).isBefore(item.date) ? 'Upcoming' : 'Ongoing';

    return (
      <TouchableOpacity>
        <Card
          mode="outlined"
          style={{
            marginBottom: 15,
            borderRadius: 16,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            backgroundColor: '#fff',
          }}>
          <Card.Title
            title={item.title}
            subtitle={`${status} - ${formattedDate}`}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="calendar"
                style={{ backgroundColor: '#4f46e5', marginRight: 10 }}
              />
            )}
            titleStyle={{
              fontSize: 18,
              fontWeight: '600',
              color: '#333',
            }}
            subtitleStyle={{
              fontSize: 14,
              color: '#008000',
            }}
          />
          <Card.Content>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{item.instruction}</Text>
            <Button
              icon="chevron-right"
              mode="contained"
              buttonColor="#0078F0"
              labelStyle={{ color: '#fff', fontWeight: '500' }}
              style={{
                borderRadius: 30,
                alignSelf: 'flex-end',
                elevation: 2,
              }}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      <View
        style={{
          backgroundColor: '#1f2937',
          padding: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar.Image
            size={70}
            source={require('@/assets/images/logo.png')}
            style={{ marginRight: 15 }}
          />
          <View>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '600' }}>{auth?.name}</Text>
            <Text style={{ color: '#aaa', fontSize: 14 }}>{auth?.id}</Text>
            <Text style={{ color: '#b0c4de', fontSize: 14 }}>San ka punta? to the moon</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, padding: 20 }}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{
            marginBottom: 15,
            borderRadius: 30,
            elevation: 4,
            backgroundColor: '#fff',
            borderColor: '#1f2937',
          }}
        />

        <Button
          icon="car"
          mode="contained"
          onPress={toggleModal}
          style={{
            marginBottom: 15,
            backgroundColor: '#0078F0',
            paddingVertical: 10,
            borderRadius: 30,
            shadowColor: '#0078F0',
            elevation: 5,
          }}
          labelStyle={{ color: '#fff', fontWeight: '600' }}>
          Book A Car
        </Button>

        {openModal && <BookACar />}

        <FlatList
          data={bookings?.bookings.sort(
            (a: IBooking, b: IBooking) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 60,
            gap: 10,
            paddingHorizontal: 10,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;
