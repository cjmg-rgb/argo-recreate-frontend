import { create } from "zustand";

interface AddBookingState {
    openModal: boolean;
    toggleModal: () => void;
};

export const useAddBookingStore = create<AddBookingState>()((set, get) => ({
    openModal: false,
    toggleModal: () => {
        set({ openModal: !get().openModal });
    } 
}));