import { IBooking, IBookings } from "~/utils/types"
import apiClient from "./apiClient";

export const createBooking = async (booking: IBooking) => {
    try {
        const response = await apiClient.post("bookings", booking);
        return response.data.data;
    } catch(error: any){
        console.log(error.response.data.message);
        return error;
    }
}

export const getAllBookings = async (): Promise<IBookings> => {
    try {
        const response = await apiClient.get("bookings");
        return response.data.data;
    } catch(error: any){
        console.log(error.response.data.message);
        return error;
    }
};