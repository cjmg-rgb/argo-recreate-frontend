import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const localIP = Constants.expoConfig?.hostUri?.split(":")[0];
const apiClient = axios.create({
        baseURL: `http://${localIP}:5000/api/`,
        headers: {
            "Content-Type": "application/json",
            "User-Agent": Platform.OS === "ios" ? "Mobile IOS" : "Mobile Android"
        }
});

apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
}, (error) => Promise.reject(error))
 
export default apiClient;