import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { logoutClient } from "~/api/auth";
import useAuthStore from "~/store/useAuthStore";

export const useLogout = () => {
    
    const router = useRouter();
    const { removeCredentials } = useAuthStore();
    
    return useMutation({
        mutationFn: logoutClient,
        mutationKey: ["logout"],
        onSuccess: () => {
            removeCredentials();
            Toast.show({
                type: "success",
                text1: "Logged Out"
            });
            router.replace("/auth/LoginScreen");
        }        
    })
}