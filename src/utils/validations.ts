import { string, z } from "zod";

export const loginFormValidation = z.object({
    email: z.string()
        .email("Invalid email"),
    password: z.string()
});

export const addBookingFormValidation = z.object({
    title: z.string().min(1, { message: "Required" }),
    location: z.string().min(1, { message: "Required" }),
    date: z.date(),
    pickUpTimeHour: z.number({
      message: "Required",
    }),
    dropOffTimeHour: z.number({
      message: "Required",
    }),
    instruction: z.string().min(1, { message: "Required" }),
    carId: z.string().min(1, {
      message: "Required",
    }),
  });

export const editBookingFormValidation = addBookingFormValidation.extend({
    id: z.string().min(1, { message: "Required" }),
})


export type loginFormInput = z.infer<typeof loginFormValidation>
export type addBookingFormInput = z.infer<typeof addBookingFormValidation>
export type editBookingFormInput = z.infer<typeof editBookingFormValidation>