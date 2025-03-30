import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllBookings } from "~/api/booking";
import { IBookings } from "~/utils/types";

export const useGetAllAbookings = (): UseQueryResult<IBookings> => {
    return useQuery<IBookings>({
        queryFn: () => getAllBookings(),
        queryKey: ["all-bookings"]
    })
}