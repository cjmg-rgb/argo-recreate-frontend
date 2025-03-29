import { loginFormInput } from "~/utils/validations";
import apiClient from "./apiClient"

export const loginClient = async ({ email, password }: loginFormInput) => {
    try {
        const response = await apiClient.post("auth/login", {email, password});
        return response.data;
    } catch(error: any) {
        throw error.response.data.message;
    }
}

export const logoutClient = async () => {
    try {
        await apiClient.post("auth/logout");
    } catch(error: any) {
        throw error.response.data.message;
    }
};