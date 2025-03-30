import { string, z } from "zod";

export const loginFormValidation = z.object({
    email: z.string()
        .email("Invalid email"),
    password: z.string()
});

export const addBookingFormValidation = z.object({
    title: z.string(),
    location: string(),
    date: z.date(),
    pickUpTimeHour: z.number(),
    dropOffTimeHour: z.number(),
    carId: z.string(),
    instruction: z.string()
})


export type loginFormInput = z.infer<typeof loginFormValidation>
export type addBookingFormInput = z.infer<typeof addBookingFormValidation>