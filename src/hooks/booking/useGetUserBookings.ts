import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getUserBookings } from "~/api/booking";
import { IBookings } from "~/utils/types";

export const useGetUserBookings = (): UseQueryResult<IBookings> => {
    return useQuery<IBookings>({
        queryKey: ["bookings"],
        queryFn: () => getUserBookings(),
    })
}