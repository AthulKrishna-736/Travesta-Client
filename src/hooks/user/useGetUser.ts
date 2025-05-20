import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getUser } from "@/services/userService"

export const useGetUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}