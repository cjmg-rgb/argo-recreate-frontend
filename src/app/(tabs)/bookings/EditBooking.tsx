import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import moment from 'moment';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useEditBooking } from '~/hooks/booking/useEditBooking';
import { useGetDrivers } from '~/hooks/driver/useGetDrivers';
import useAuthStore from '~/store/useAuthStore';
import { useBookingStore } from '~/store/useBookingStore';
import { getTimeLabel, time } from '~/utils/helpers';
import { IBookings, IEditBookingForm } from '~/utils/types';
import { editBookingFormInput, editBookingFormValidation } from '~/utils/validations';

const EditBooking = () => {
  const { booking } = useBookingStore();
  const { data: drivers } = useGetDrivers();
  const { mutate: editBooking, error } = useEditBooking();
  const { auth, updateCredits } = useAuthStore();
  const router = useRouter();

  if (!booking) {
    return <Text>Error</Text>;
  }

  // DATE
  interface CalendarType {
    dateString: string;
    day: number;
    month: number;
    timestamp: number;
    year: number;
  }
  const [dateError, setDateError] = useState<string | null>('.');
  const handleDate = (day: CalendarType): boolean => {
    if (moment().isAfter(day.dateString)) {
      setDateError(`${day.dateString} Please select a valid day`);
      return false;
    }
    return true;
  };

  // TIME
  const [openPickup, setOpenPickUp] = useState(false);
  const [openDropOff, setOpenDropOff] = useState(false);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<editBookingFormInput>({
    defaultValues: {
      carId: booking?.car.id,
      date: new Date(booking.date),
      dropOffTimeHour: new Date(booking.dropOffTime).getHours(),
      pickUpTimeHour: new Date(booking.pickUpTime).getHours(),
      id: booking.id,
      instruction: booking.instruction,
      location: booking.location,
      title: booking.title,
    },
    resolver: zodResolver(editBookingFormValidation),
  });

  if (errors) {
    console.log(errors);
  }

  const queryClient = useQueryClient();
  const onSubmit: SubmitHandler<editBookingFormInput> = (data) => {
    editBooking(data, {
      onSuccess: (data) => {
        const updatedUserCredits = auth!.credits + booking.creditDeduction - data.creditDeduction;

        updateCredits(updatedUserCredits);

        const bookingsQuerySetter = (queryData: IBookings): IBookings => ({
          ...queryData,
          bookings: queryData?.bookings.map((booking) => (booking.id === data.id ? data : booking)),
        });
        queryClient.setQueryData(['all-bookings'], bookingsQuerySetter);

        if (queryClient.getQueryData(['bookings'])) {
          queryClient.setQueryData(['bookings'], bookingsQuerySetter);
        }

        router.back();
        Toast.show({
          type: 'success',
          text1: 'Booking Updated',
        });
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="h-screen flex-1">
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
          }}>
          <View className="p-4">
            <Controller
              control={control}
              name="title"
              defaultValue={booking.title}
              render={({ field: { value, onBlur, onChange } }) => (
                <View>
                  <Text>Title</Text>
                  <TextInput value={value} onChangeText={(val) => onChange(val)} onBlur={onBlur} />
                </View>
              )}
            />
            <Controller
              control={control}
              name="location"
              defaultValue={booking.location}
              render={({ field: { value, onBlur, onChange } }) => (
                <View>
                  <Text>Location</Text>
                  <TextInput value={value} onChangeText={onChange} onBlur={onBlur} />
                </View>
              )}
            />

            <Controller
              control={control}
              name="instruction"
              defaultValue={booking.instruction}
              render={({ field: { value, onBlur, onChange } }) => (
                <View>
                  <Text>Instruction</Text>
                  <TextInput value={value} onChange={onChange} onBlur={onBlur} />
                </View>
              )}
            />

            <Controller
              name="date"
              control={control}
              render={({ field: { value } }) => {
                return (
                  <View className="flex gap-4">
                    <Text className="text-center text-3xl font-bold">Select a Date</Text>
                    <Calendar
                      onDayPress={(day: CalendarType) => {
                        if (handleDate(day)) {
                          setValue('date', new Date(day.dateString));
                          setDateError(null);
                        }
                      }}
                      theme={{
                        backgroundColor: '#1f2937',
                        calendarBackground: '#1f2937',
                        textSectionTitleColor: '#9ca3af',
                        dayTextColor: '#f3f4f6',
                        todayTextColor: '#4f46e5',
                        selectedDayBackgroundColor: '#4f46e5',
                        selectedDayTextColor: '#ffffff',
                        arrowColor: '#4f46e5',
                        monthTextColor: '#e5e7eb',
                      }}
                    />
                    <View className="items-center justify-center">
                      {value && !dateError ? (
                        <Button
                          icon="check"
                          mode="outlined"
                          textColor="green"
                          style={{
                            borderColor: 'green',
                          }}
                          onPress={() => Toast.show({ type: 'success', text1: 'Valid Day' })}>
                          <Text> {value.toLocaleDateString()} </Text>
                        </Button>
                      ) : (
                        <Text>{format(booking?.date, 'MMM dd, y')}</Text>
                      )}
                    </View>
                    {dateError && <Text className="text-center text-red-500">{dateError}</Text>}
                  </View>
                );
              }}
            />

            <View className="flex flex-row justify-around gap-2">
              {/* PICK-UP */}
              <Controller
                control={control}
                name="pickUpTimeHour"
                render={({ field: { value, onChange } }) => {
                  const title = watch('pickUpTimeHour')
                    ? getTimeLabel(watch('pickUpTimeHour'))
                    : 'Pick-Up Time';

                  return (
                    <View>
                      <Button onPress={() => setOpenPickUp(true)}>
                        <Text>{title}</Text>
                      </Button>

                      <Modal visible={openPickup} transparent animationType="slide">
                        <View
                          className="flex-1 justify-center p-4"
                          style={{
                            backgroundColor: 'rgba(31, 41, 55, .9)',
                          }}>
                          <View className="bg-[#1f2937] p-20">
                            <Text className="text-center text-3xl font-medium text-white">
                              Pick-Up Time
                            </Text>
                            <Picker
                              selectedValue={value}
                              onValueChange={(itemValue) => {
                                onChange(Number(itemValue));
                                setOpenPickUp(false);
                              }}
                              itemStyle={{
                                color: 'white',
                              }}>
                              {time
                                .filter(({ indexValue }) => {
                                  const dropOffTime = watch('dropOffTimeHour') as number;
                                  return dropOffTime ? indexValue < dropOffTime : true;
                                })
                                .map(({ label, indexValue }) => (
                                  <Picker.Item
                                    key={indexValue}
                                    label={label}
                                    value={indexValue.toString()}
                                  />
                                ))}
                            </Picker>
                            <Button onPress={() => setOpenPickUp(false)}>
                              <Text>Close</Text>
                            </Button>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  );
                }}
              />
              {/* DROP-OFF */}
              <Controller
                control={control}
                name="dropOffTimeHour"
                render={({ field: { value, onChange } }) => {
                  const parsedTime = Number(watch('dropOffTimeHour'));
                  const title = parsedTime ? getTimeLabel(parsedTime) : 'Drop-Off Time';

                  return (
                    <View>
                      <Button onPress={() => setOpenDropOff(true)}>
                        <Text>{title}</Text>
                      </Button>

                      <Modal visible={openDropOff} transparent animationType="slide">
                        <View
                          className="flex-1 justify-center p-4"
                          style={{
                            backgroundColor: 'rgba(31, 41, 55, .9)',
                          }}>
                          <View className="bg-[#1f2937] p-20">
                            <Text className="text-center text-3xl font-medium text-white">
                              Drop-Off Time
                            </Text>
                            <Picker
                              selectedValue={value}
                              onValueChange={(itemValue) => {
                                onChange(Number(itemValue));
                                setOpenDropOff(false);
                              }}
                              itemStyle={{
                                color: 'white',
                              }}>
                              {time
                                .filter(({ indexValue }) => {
                                  const dropOffTime = watch('pickUpTimeHour') as number;
                                  return dropOffTime ? indexValue > dropOffTime : true;
                                })
                                .map(({ label, indexValue }) => (
                                  <Picker.Item
                                    key={indexValue}
                                    label={label}
                                    value={indexValue.toString()}
                                  />
                                ))}
                            </Picker>
                            <Button onPress={() => setOpenDropOff(false)}>
                              <Text>Close</Text>
                            </Button>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  );
                }}
              />
            </View>
            <View className="flex flex-col justify-center gap-4 rounded-xl bg-white p-4">
              <Text className="text-center text-3xl font-bold">Select a Car</Text>
              <Controller
                control={control}
                name="carId"
                render={({ field: { value, onChange } }) => {
                  const selectedCarID = watch('carId');

                  return (
                    <View className="flex flex-row justify-center gap-2">
                      {drivers?.map((driver) => (
                        <View key={driver.id}>
                          <Button
                            icon="camera"
                            mode="elevated"
                            onPress={() => {
                              onChange(driver.car?.id);
                            }}
                            style={{
                              borderColor: `${!selectedCarID ? driver.car?.colorTag.label : selectedCarID === driver.car?.id ? 'green' : driver?.car?.colorTag.label}`,
                              borderWidth: 2,
                            }}
                            textColor={`${driver.car?.colorTag.label}`}>
                            <Text>{driver.name}</Text>
                          </Button>
                        </View>
                      ))}
                    </View>
                  );
                }}
              />
            </View>
            <View>
              <Button
                icon="pen"
                mode="contained"
                buttonColor="#0078F0"
                textColor="#ffffff"
                className="px-4 py-2"
                onPress={handleSubmit(onSubmit)}>
                Edit Booking
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default EditBooking;
