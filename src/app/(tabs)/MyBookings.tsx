import { View, Text, Button, Platform, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Calendar } from 'react-native-calendars'
import moment from 'moment';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { addBookingFormInput, addBookingFormValidation } from '~/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from "@react-native-picker/picker";
import { getTimeLabel, time } from '~/utils/helpers';
import { useGetDrivers } from '~/hooks/driver/useGetDrivers';
import { Button as RNButton, TextInput } from 'react-native-paper';
import { useGetAllAbookings } from '~/hooks/booking/useGetAllBookings';
import { Keyboard } from 'react-native';
import { ScrollView } from 'react-native';
import { useAddBooking } from '~/hooks/booking/useAddBooking';
import Toast from 'react-native-toast-message';

interface CalendarType {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
}

const MyBookings = () => {

  // FORM
  const { 
    control, 
    watch, 
    setValue, 
    formState: { errors }, 
    handleSubmit,
    reset 
  } = useForm<addBookingFormInput>({
    resolver: zodResolver(addBookingFormValidation)
  })

  
  // DATE
  const [dateError, setDateError] = useState<string | null>(".");
  const handleDate = (day: CalendarType): boolean => {
    if(moment().isAfter(day.dateString)) {
      setDateError(`${day.dateString} Please select a valid day`);
      return false
    }
    return true;
  }
  
  // TIME
  const [openPickup, setOpenPickUp] = useState(false);
  const [openDropOff, setOpenDropOff] = useState(false);

  // Driver
  const { data: drivers } = useGetDrivers();
  const { data: bookings } = useGetAllAbookings();
  
  // Submit
  const { mutate: addBooking, error } = useAddBooking();

  if(errors) {
    console.log(errors);
    
  }

  const onSubmit: SubmitHandler<addBookingFormInput> = async (booking) => {
    
    addBooking(booking); 
    reset(); 
  }
  

  return (
    <SafeAreaView className='flex-1'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className='flex-1 h-screen'
      >
        <ScrollView className='flex-1 h-screen' contentContainerStyle={{
          paddingBottom: 250
        }}>

          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View className='h-screen p-4 gap-4'>

              {/* DATE */}
              <Controller
                name='date'
                control={control}
                render={({
                  field: { value }
                }) => (
                  <View className='flex gap-4'>
                    <Text className='text-center text-3xl font-bold'>Select a Date</Text>
                    <Calendar
                      onDayPress={(day: CalendarType) => {
                        if(handleDate(day)) {
                          setValue("date", new Date(day.dateString))
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
                    <View className='justify-center items-center'>{ 
                      (value && !dateError) ? 
                      <RNButton 
                        icon="check" 
                        mode="outlined" 
                        textColor='green'
                        style={{
                          borderColor: "green"
                        }}
                        onPress={() => Toast.show({ type: "success", text1: "Valid Day" })}
                      >
                        <Text> { value.toLocaleDateString() } </Text>
                      </RNButton> : <Text>Select a Date</Text> }
                    </View>
                    { dateError && <Text className='text-red-500 text-center'>{ dateError }</Text>}
                    
                  </View>
                )}
              />

              {/* TIME */}
              {!dateError && <View className=' bg-white p-4 gap-2 rounded-xl'>
                <Text className='text-center text-3xl font-bold'>Select a Time</Text>
                <View className='justify-around gap-2 flex flex-row'>
                  {/* PICK-UP */}
                  <Controller
                    control={control}
                    name="pickUpTimeHour"
                    render={({
                      field: { value, onChange }
                    }) => { 
                      
                      const parsedTime = Number(watch("pickUpTimeHour"));
                      const title = parsedTime ? getTimeLabel(parsedTime) : "Pick-Up Time";

                    return (
                    <View>
                      <Button title={`${title}`} onPress={() => setOpenPickUp(true)} />

                      <Modal visible={openPickup} transparent animationType="slide">
                        <View className='flex-1 justify-center p-4' style={{
                            backgroundColor: "rgba(31, 41, 55, .9)"
                          }}>
                          <View className='p-20 bg-[#1f2937]'>
                            <Text className='text-center text-white font-medium text-3xl'>Pick-Up Time</Text>
                            <Picker
                              selectedValue={value}
                              onValueChange={(itemValue) => {
                                onChange(Number(itemValue));
                                setOpenPickUp(false); 
                              }}
                              itemStyle={{
                                color: "white"
                              }}
                            >
                            {time
                              .filter(({ indexValue }) => {
                                const dropOffTime = watch("dropOffTimeHour") as number;
                                return dropOffTime ? indexValue < dropOffTime : true;
                              })
                              .map(({ label, indexValue }) => (
                                <Picker.Item key={indexValue} label={label} value={indexValue.toString()} />
                              ))}
                            </Picker>
                            <Button title="Close" onPress={() => setOpenPickUp(false)} />
                          </View>
                        </View>
                      </Modal>

                    </View>
                    )}}  
                  />
                  {/* DROP-OFF */}
                  <Controller
                    control={control}
                    name="dropOffTimeHour"
                    render={({
                      field: { value, onChange }
                    }) => { 

                      const parsedTime = Number(watch("dropOffTimeHour"));
                      const title = parsedTime ? getTimeLabel(parsedTime) : "Drop-Off Time";

                      return (
                    <View>
                      <Button title={`${ title }`} onPress={() => setOpenDropOff(true)} />

                      <Modal visible={openDropOff} transparent animationType="slide">
                        <View className='flex-1 justify-center p-4' style={{
                            backgroundColor: "rgba(31, 41, 55, .9)"
                          }}>
                          <View className='p-20 bg-[#1f2937]'>
                            <Text className='text-center text-white font-medium text-3xl'>Drop-Off Time</Text>
                            <Picker
                              selectedValue={value}
                              onValueChange={(itemValue) => {
                                onChange(Number(itemValue));
                                setOpenDropOff(false); 
                              }}
                              itemStyle={{
                                color: "white"
                              }}
                            >
                              {time.filter(({ indexValue }) => {
                                const dropOffTime = watch("pickUpTimeHour") as number;
                                return dropOffTime ? indexValue > dropOffTime : true;
                              })
                              .map(({ label, indexValue }) => (
                                <Picker.Item key={indexValue} label={label} value={indexValue.toString()} />
                              ))}
                            </Picker>
                            <Button title="Close" onPress={() => setOpenDropOff(false)} />
                          </View>
                        </View>
                      </Modal>
                    </View>
                    )}} 
                  />
              
                </View> 
              </View>}

              {/* Driver */}
              {!dateError && drivers && 
              <View className='flex flex-col justify-center bg-white p-4 gap-4 rounded-xl'>
                  <Text className='text-center font-bold text-3xl'>Select a Driver</Text>
                  <Controller
                    control={control}
                    name='carId'
                    render={({ field: { value, onChange }}) => {

                        const selectedCarID = watch("carId");

                      return (
                      <View
                        className='flex flex-row gap-2 justify-center'
                      >
                        {drivers.map(driver => (
                          <View 
                            key={ driver.id }
                          >
                            <RNButton 
                              icon="camera" 
                              mode="elevated" 
                              onPress={() => {
                                onChange(driver.car?.id)
                              }}
                              style={{
                                borderColor: `${!selectedCarID ? driver.car?.colorTag.label : selectedCarID === driver.car?.id ? 'green' : driver?.car?.colorTag.label }`,
                                borderWidth: 2
                              }}
                              textColor={`${ driver.car?.colorTag.label }`}
                              
                            >
                              <Text>
                                { driver.name }
                              </Text>
                            </RNButton>
                          </View>
                        ))
                      }
                      </View>
                    )}}
                  />
              </View>
              }
              { watch("carId") && 
                <View className='bg-white p-4 rounded-lg'>
                    <Text className='text-center text-3xl font-bold'>Other Details</Text>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <TextInput
                            label="Title"
                            mode="outlined"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.title}
                            placeholder='e.g. General Meeting'
                          />
                          {errors.title && (
                            <Text style={{ color: "red", marginTop: 5 }}>{errors.title.message}</Text>
                          )}
                        </View>
                      )}
                    />

                    <Controller
                      control={control}
                      name="location"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <TextInput
                            label="Location"
                            mode="outlined"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.location}
                            placeholder='e.g. Pasay City'
                          />
                          {errors.location && (
                            <Text style={{ color: "red", marginTop: 5 }}>{errors.location.message}</Text>
                          )}
                        </View>
                      )}
                    />
                    <Controller
                      control={control}
                      name="instruction"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <TextInput
                            label="Instructions"
                            mode="outlined"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            multiline={true} 
                            numberOfLines={4} 
                            style={{ minHeight: 100 }} 
                            error={!!errors.instruction}
                            
                          />
                          {errors.instruction && (
                            <Text style={{ color: "red", marginTop: 5 }}>
                              {errors.instruction.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />
                </View>
              }
              { 
                watch("instruction") && !dateError &&
                <View>
                  <RNButton
                    icon="car"
                    mode="contained"
                    buttonColor="#0078F0"
                    textColor="#ffffff"
                    onPress={handleSubmit(onSubmit)}
                    className='px-4 py-2'
                  >
                    Book A Car
                  </RNButton>
                </View>
              }
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MyBookings