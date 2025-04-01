import { IBooking, IBookings, IEditBookingForm } from "~/utils/types"
import apiClient from "./apiClient";
import { formatDateObjectToString } from "~/utils/helpers";
import { MutationFunction } from "@tanstack/react-query";

export const createBooking = async (booking: IBooking) => {
    try {
        const response = await apiClient.post("bookings", booking);
        return response.data.data;
    } catch(error: any){
        console.log(error.response.data.message);
        throw Error(error.response.data.message);
        
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

export const getUserBookings = async (): Promise<IBookings> => {
    try {
        const response = await apiClient.get("bookings/my-bookings");
        return response.data.data;
    } catch(error: any){
        console.log(error.response.data.message);
        return error;
    } 

}

export const deleteBooking = async (id: string) => {
    try {
        const response = await apiClient.delete("bookings/" + id);
        return response.data.data;
    } catch(error: any){
        console.log(error.response.data.message);
        return error;
    } 
};

export const editBooking: MutationFunction<IBooking, IEditBookingForm> = async({ id, date, ...rest}: IEditBookingForm) => { 
    try {

        const response = await apiClient.patch("bookings/" + id, {
            date: formatDateObjectToString({
                year: date!.getFullYear(),
                month: date!.getMonth() + 1,
                date: date!.getDate(),
              }),
            ...rest
        });
        return response.data.data;
    } catch(error: any){
        console.log(error.response.data.message);
        return error;
    } 

}