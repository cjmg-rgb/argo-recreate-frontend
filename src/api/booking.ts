import { IBookings } from "~/utils/types";
import apiClient from "./apiClient";

export const getAllBookings = async (): Promise<IBookings> => {
    try {
        const response = await apiClient.get("bookings");
        return response.data.data;
    } catch(error: any){
        console.log(error.response.data.message);
        return error;
    }
};