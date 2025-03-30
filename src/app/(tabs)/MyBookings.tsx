import { View, Text, Button, Platform, Modal } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Calendar } from 'react-native-calendars'
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { addBookingFormInput, addBookingFormValidation } from '~/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from "@react-native-picker/picker";
import { getTimeLabel, time } from '~/utils/helpers';
import { useGetDrivers } from '~/hooks/driver/useGetDrivers';
import { Button as RNButton } from 'react-native-paper';
import { useGetAllAbookings } from '~/hooks/booking/useGetAllBookings';

interface CalendarType {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
}

const MyBookings = () => {

  // FORM
  const { control, watch, setValue } = useForm<addBookingFormInput>({
    resolver: zodResolver(addBookingFormValidation),
    defaultValues: {
      pickUpTimeHour: 6
    }
  })

  
  // DATE
  const [dateError, setDateError] = useState<string | null>(".");
  const handleDate = (day: CalendarType): boolean => {
    if(moment().isAfter(day.dateString)) {
      setDateError(`${day.dateString} is already done, Please select a valid date`);
      return false
    }
    return true;
  }
  
  // TIME
  const [openPickup, setOpenPickUp] = useState(false);
  const [openDropOff, setOpenDropOff] = useState(false);

  // Driver
  const { data: drivers, isPending, error } = useGetDrivers();
  const { data: bookings } = useGetAllAbookings();
  console.log(bookings?.bookings);
  


  return (
    <SafeAreaView>
        <View className='p-4 gap-4'>

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
                  
                />
                <Text className='text-center'>{ (value && !dateError) ? value.toLocaleDateString() : "Select a Date" }</Text>
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
                            onChange(itemValue);
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
                            onChange(itemValue);
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
                render={({ field: { value, onChange }}) => (
                  <View
                    className='flex flex-row gap-2'
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
                            borderColor: `${ driver.car?.colorTag.label }`,
                            borderWidth: 1,
                          }}
                          textColor={`${ driver.car?.colorTag.label }`}
                          
                        >
                          { driver.name }
                        </RNButton>
                      </View>
                    ))
                  }
                  </View>
                )}
              />
          </View>
          }
        </View>

    </SafeAreaView>
  )
}

export default MyBookings