import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { editBooking } from "~/api/booking";
import { IBooking, IEditBookingForm } from "~/utils/types";

export const useEditBooking = (): UseMutationResult<IBooking, Error, IEditBookingForm> => {
    return useMutation<IBooking, Error, IEditBookingForm>({
        mutationFn: editBooking,
        mutationKey: ["edit-booking"]
    })
}