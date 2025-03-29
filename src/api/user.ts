import { IUser } from "~/utils/types";
import apiClient from "./apiClient"

export const getUser = async (): Promise<IUser> => {
    try {
        const response = await apiClient.get(`users/me`)
        return response.data?.data;
    } catch(error: any) {
        console.log(error.response.data.message);
        return error;
    }
}