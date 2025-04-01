import { create, createStore, StateCreator } from 'zustand';
import { IAuth } from '~/utils/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authStoreState: StateCreator<IAuth> = (set, get) => ({
  auth: null,
  token: null,
  updateCredits(credits: number) {
    set((prev) => ({
      auth: {
        ...(prev.auth as NonNullable<IAuth['auth']>),
        credits,
      },
    }));
  },
  async setCredentials(credentials, token) {
    set({ auth: credentials, token });
    await AsyncStorage.setItem('token', token);
  },
  async removeCredentials() {
    set({ auth: null, token: null });
    await AsyncStorage.removeItem('token');
  },
});

const useAuthStore = create<IAuth>()(
  persist(authStoreState, {
    name: 'auth',
    storage: createJSONStorage(() => AsyncStorage),
  })
);

export default useAuthStore;
