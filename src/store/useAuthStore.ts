import { create, createStore, StateCreator } from "zustand";
import { IAuth } from "~/utils/types";
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage";

const authStoreState: StateCreator<IAuth> = (set, get) => ({
    auth: null,
    token: null,
    updateCredits() {

    },
    setCredentials(credentials, token) {
        set({ auth: credentials, token })
    },
    removeCredentials() {
        set({ auth: null, token: null })
    }
});

const useAuthStore = create<IAuth>()(persist(authStoreState, {
    name: "auth",
    storage: createJSONStorage(() => AsyncStorage)
}))

export default useAuthStore;