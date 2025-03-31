import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Card, Appbar } from 'react-native-paper';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetAllAbookings } from '~/hooks/booking/useGetAllBookings';

interface IBooking {
  id: string;
  title: string;
  instruction: string;
  date: string;
  bookedBy: { name: string };
}

const MyBookings: React.FC = () => {
  const { data: bookings } = useGetAllAbookings();
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string } }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<{ [key: string]: IBooking[] }>({});

  useEffect(() => {
    if (bookings?.bookings) {
      const dates: { [key: string]: { marked: boolean; dotColor: string } } = {};
      const eventsMap: { [key: string]: IBooking[] } = {};
      bookings.bookings.forEach((booking: IBooking) => {
        const dateKey = moment(booking.date).format('YYYY-MM-DD');
        dates[dateKey] = { marked: true, dotColor: 'blue' };
        if (!eventsMap[dateKey]) {
          eventsMap[dateKey] = [];
        }
        eventsMap[dateKey].push(booking);
      });
      setMarkedDates(dates);
      setEvents(eventsMap);
    }
  }, [bookings]);

  const handleDayPress = (day: DateData) => {
    const newMarkedDates = Object.keys(markedDates).reduce((acc, key) => {
      acc[key] = { ...markedDates[key], selected: false, selectedColor: undefined };
      return acc;
    }, {} as typeof markedDates);
    
    setSelectedDate(day.dateString);
    setMarkedDates({
      ...newMarkedDates,
      [day.dateString]: { ...newMarkedDates[day.dateString], selected: true, selectedColor: 'green' },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <Appbar.Header style={{
        backgroundColor: "#1f2937",
      }}>
        <Appbar.Content color='#ffffff' title="Bookings Calendar" className="text-white text-lg font-bold"  />
      </Appbar.Header>
      <View className="flex-1 p-4 gap-4">
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#1f2937',
            todayTextColor: '#1f2937',
            arrowColor: '#1f2937',
          }}
        />
        {selectedDate && events[selectedDate] && (
          <FlatList
            data={events[selectedDate]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              gap: 4
            }}
            renderItem={({ item }) => (
              <Card className="my-2 p-4 bg-white rounded-lg shadow-md overflow-hidden">
                <Card.Content>
                  <Text className="text-lg font-bold text-[#1f2937]">{item.title}</Text>
                  <Text className="text-gray-600">{item.instruction}</Text>
                  <Text className="mt-2 italic text-gray-500">Booked by: {item.bookedBy.name}</Text>
                </Card.Content>
              </Card>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyBookings;
