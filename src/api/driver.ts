import { IDriver } from "~/utils/types";
import apiClient from "./apiClient"

export const getDrivers = async (): Promise<IDriver[]> => {
    try {
        const response = await apiClient.get("drivers");
        return response.data.data.drivers;
    } catch(error: any) { 
        console.log(error);
        return error;
    }
}