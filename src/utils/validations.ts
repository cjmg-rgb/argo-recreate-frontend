import { z } from "zod";

export const loginFormValidation = z.object({
    email: z.string()
        .email("Invalid email"),
    password: z.string()
});


export type loginFormInput = z.infer<typeof loginFormValidation>