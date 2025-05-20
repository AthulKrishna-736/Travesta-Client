import { getVendor } from "@/services/vendorService"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useGetVendor = () => {
    return useQuery({
        queryKey: ['vendor'],
        queryFn: () => getVendor(),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}