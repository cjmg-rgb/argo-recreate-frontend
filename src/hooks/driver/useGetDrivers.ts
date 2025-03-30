import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getDrivers } from "~/api/driver";
import { IDriver } from "~/utils/types";

export const useGetDrivers = (): UseQueryResult<IDriver[]> => {
    return useQuery<IDriver[]>({
        queryFn: () => getDrivers(),
        queryKey: ["drivers"]
    })
};