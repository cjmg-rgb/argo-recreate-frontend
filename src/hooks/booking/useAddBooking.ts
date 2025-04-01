import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { createBooking } from '~/api/booking';
import { IBookings } from '~/utils/types';

export const useAddBooking = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: any) => createBooking(booking),
    mutationKey: ['bookings'],
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['all-bookings'],
      });
      Toast.show({
        type: 'success',
        text1: 'Booked Successfully',
      });
      router.replace('/bookings');
    },
    onError: (error) => {
      Alert.alert('Book Failed', error.message, [{ text: 'Aww', style: 'default' }]);
    },
  });
};
