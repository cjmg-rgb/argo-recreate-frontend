import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { createBooking } from "~/api/booking";

export const useAddBooking = ()=> {
    
    const router = useRouter();

    return useMutation({
        mutationFn: (booking: any) => createBooking(booking),
        mutationKey: ["bookings"],
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Booked Successfully"
            });
            router.replace("/bookings");
        },
        onError: (error) => {
            Alert.alert("Book Failed", error.message, [
                { text: "Aww", style: "default" }
            ])
        }
    })
}