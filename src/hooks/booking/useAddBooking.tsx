import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { createBooking } from "~/api/booking";

export const useAddBooking = ()=> {
    return useMutation({
        mutationFn: (booking: any) => createBooking(booking),
        mutationKey: ["bookings"],
        onSuccess: (data) => {
            Toast.show({
                type: "success",
                text1: "Booked Successfully"
            })
        },
        onError: (error) => {
            console.log(error.message);
            Toast.show({
                type: 'error',
                text1: error.message
            })
        }
    })
}