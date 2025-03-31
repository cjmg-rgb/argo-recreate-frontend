import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { deleteBooking } from "~/api/booking";

export const useDeleteBooking = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBooking(id),
        mutationKey: ["bookings"],
        onSuccess: () =>{
            
            Toast.show({
                type: "success",
                text1: "Deleted"
            });
            queryClient.invalidateQueries({
                queryKey: ["bookings"]
            })
        },
        onError: (error) => {
            Toast.show({
                type: "error",
                text1: error.message
            })
        }
    })
};