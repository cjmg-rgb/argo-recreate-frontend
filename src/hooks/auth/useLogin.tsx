import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { loginClient } from '~/api/auth';
import useAuthStore from '~/store/useAuthStore';
import { IUser } from '~/utils/types';
import { loginFormInput } from '~/utils/validations';

export const useLogin = (): UseMutationResult<IUser, Error, loginFormInput> => {
  const router = useRouter();
  const { setCredentials } = useAuthStore();

  return useMutation({
    mutationFn: loginClient,
    mutationKey: ['login-user'],
    onSuccess: (data) => {
      setCredentials(data.data, data.token);
      Toast.show({
        type: 'success',
        text1: `WELCOME BACK ${data.data.name}`,
      });
      router.replace('/bookings');
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: `${error}`,
      });
    },
  });
};
