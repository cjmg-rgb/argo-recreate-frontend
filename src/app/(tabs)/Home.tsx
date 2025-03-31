import React from 'react';
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { Appbar, Card, Avatar, Button, IconButton, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetUserBookings } from '~/hooks/booking/useGetUserBookings';
import useAuthStore from '~/store/useAuthStore';
import { IBooking } from '~/utils/types';
import { format } from 'date-fns';
import moment from 'moment';

const BookingScreen = () => {

  const { data: bookings } = useGetUserBookings();
  const { auth } = useAuthStore();

  const [searchQuery, setSearchQuery] = React.useState('');



  const renderItem = (item: IBooking) => { 

    const formattedDate = format(item.date, "MMM dd, y");
    const status = moment(new Date()).isBefore(item.date) ? "Upcoming" : "Ongoing";
        
    return (
    <TouchableOpacity>
      <Card
        className="mb-4 mx-4 rounded-xl"
        mode="contained"
        style={{
          backgroundColor: '#f3f4f6', 
          overflow: 'hidden', 
          elevation: 0, 
          shadowColor: "transparent", 
        }}
      >
        <Card.Title
          title={item.title}
          subtitle={`${status} - ${ formattedDate }`}
          left={(props) => <Avatar.Icon {...props} icon="calendar" style={{ backgroundColor: '#4f46e5' }} />}
          subtitleStyle={{
            color: "green",
          }}
          titleStyle={{

          }}
        />
        <Card.Content>
          <Text className="text-gray-600 mb-2">{item.instruction}</Text>
          <Button icon="chevron-right" className="self-end" textColor="#4f46e5">
            View Details
          </Button>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )};

  return (
    <SafeAreaView className="flex-1 bg-gray-200 pb-[70]">
      <View className="bg-[#1f2937] p-6 rounded-b-3xl shadow-lg mb-4">
        <View className="flex-row items-center">
          <Avatar.Image
            size={70}
            source={ require("@/assets/images/logo.png") }
            className="mr-4"
          />
          <View>
            <Text className="text-white text-xl font-semibold">Welcome Back, { auth?.name }!</Text>
            <Text className='text-sm text-gray-500'>{ auth?.id }</Text>
            <Text className="text-blue-200 text-sm">Ready for your next adventure?</Text>
          </View>
        </View>
        <View className="mt-4 flex-row justify-around">
          <TouchableOpacity className="items-center">
            <IconButton icon="calendar" size={30} iconColor="white" />
            <Text className="text-white text-sm">My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <IconButton icon="account-circle" size={30} iconColor="white" />
            <Text className="text-white text-sm">Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <IconButton icon="cog" size={30} iconColor="white" />
            <Text className="text-white text-sm">Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View className='p-4'>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{
            borderColor: "#1f2937",
            boxShadow: "0px 0px 5px 0px black"
          }}
        />
      </View>

      <FlatList
        data={ bookings?.bookings }
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
      />
    </SafeAreaView>
  );
};

export default BookingScreen;
