import { create } from "zustand";
import { IBooking } from "~/utils/types";

interface BookingStore {
    booking: IBooking | null;
    setBooking: (booking: IBooking) => void;
}

export const useBookingStore = create<BookingStore>()((set, get) => ({
    booking: null,
    setBooking: (booking: IBooking) => {
        set({ booking });
    }
})); 