// BookingInfo.tsx
import { View, Text, Alert, ScrollView, Linking, Platform } from 'react-native';
import { Button, Card, Divider, IconButton } from 'react-native-paper';
import { useBookingStore } from '~/store/useBookingStore';
import moment from 'moment';
import { format } from 'date-fns';
import { useDeleteBooking } from '~/hooks/booking/useDeleteBooking';
import { useRouter } from 'expo-router';

const Booking = () => {
    const router = useRouter();
    const { booking } = useBookingStore();
    const { mutate: deleteBooking } = useDeleteBooking();

    if(!booking) {
        return router.push("/bookings");
    }

    const formattedDate = format(booking?.date, "MMM dd, y");
    const formattedPickUp = format(booking?.pickUpTime, "h a")
    const formattedDropOff = format(booking?.dropOffTime, "h a")
    const status = moment(new Date()).isBefore( booking?.date ) ? "Upcoming" : "Ongoing";
  

  const handleCallDriver = () => {
    const phoneNumber = Platform.select({
      ios: `telprompt:${ booking?.car.driver.number }`,
      android: `tel:${ booking?.car.driver.number }`,
    });
    Linking.openURL(phoneNumber || "");
  };

  const handleDeleteBooking = () => {
    Alert.alert(
      "Delete Booking",
      "Are you sure you want to delete this booking?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          deleteBooking(booking.id);
          router.back();
        }}
      ]
    );
  };


  // Handle Edit
  const handleEditBooking = () => {
   
  };

  return (
      <ScrollView className="p-4">
    
        <View className="mb-4 flex-row justify-between items-center bg-[#1f2937] p-4 rounded-lg">
          <Text className="text-2xl font-bold text-white">{ booking.title.toUpperCase() }</Text>
          <View className="flex-row">
            <IconButton
              icon="pencil"
              mode="contained"
              onPress={handleEditBooking}
              className="bg-[#0078F0]"
              iconColor="#ffffff"
            />
            <IconButton
              icon="delete"
              mode="contained"
              onPress={handleDeleteBooking}
              className="bg-red-500"
              iconColor="#ffffff"
            />
          </View>
        </View>

        <Card className="bg-white rounded-lg p-4 mb-4 shadow-sm overflow-hidden">
          <Card.Content>

            {/* Location */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-[#1f2937]">Location</Text>
              <Text className="text-base text-gray-600">{ booking?.location }</Text>
            </View>

            {/* Instruction */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-[#1f2937]">Instruction</Text>
              <Text className="text-base text-gray-600">{ booking?.instruction }</Text>
            </View>

            <Divider className="my-2" />

            {/* Booking Date */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-[#1f2937]">Booking Date</Text>
              <Text className="text-base text-gray-600">{ formattedDate }</Text>
            </View>

            {/* Pickup and Dropoff Times */}
            <View className="flex-row justify-between mb-4">
              <View className="w-1/2">
                <Text className="text-lg font-semibold text-[#1f2937]">Pick-Up Time</Text>
                <Text className="text-base text-gray-600">{ formattedPickUp }</Text>
              </View>
              <View className="w-1/2">
                <Text className="text-lg font-semibold text-[#1f2937]">Drop-Off Time</Text>
                <Text className="text-base text-gray-600">{ formattedDropOff }</Text>
              </View>
            </View>

            <Divider className="my-2" />

            {/* Car Details */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-[#1f2937]">Car Details</Text>
              <Text className="text-base text-gray-600">Model: { booking?.car.model }</Text>
              <Text className="text-base text-gray-600">Plate Number: { booking?.car.plateNumber }</Text>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold text-[#1f2937]">Driver</Text>
              <Text className="text-base text-gray-600">Name: { booking?.car.driver.name }</Text>
              <Text className="text-base text-gray-600">Contact: { booking?.car.driver.number }</Text>
              <Button
                icon="phone"
                mode="contained"
                onPress={handleCallDriver}
                style={{ backgroundColor: "#0078F0", marginTop: 10 }}
              >
                Call Driver
              </Button>
            </View>

            <Divider className="my-2" />
            
            {/* Driver */}
            <View className='flex flex-row justify-between items-center'>
              <Text className="text-lg font-semibold text-[#1f2937]">Status</Text>
              <Text
                className={`text-base font-bold ${
                  status === "Ongoing"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {status}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
  );
};

export default Booking;
