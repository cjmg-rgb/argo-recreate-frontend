import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getUser } from "~/api/user";
import useAuthStore from "~/store/useAuthStore";
import { IUser } from "~/utils/types";

export const useGetUser = (): UseQueryResult<IUser> => {
    return useQuery<IUser>({
        queryFn: () => getUser(),
        queryKey: ["user"]
    })
} 