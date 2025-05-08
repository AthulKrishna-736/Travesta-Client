import { getVendors } from "@/services/adminService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetVendors = (page: number, limit: number)=> {
    return useQuery({
        queryKey: ['admin-vendor', page, limit],
        queryFn: () => getVendors(page, limit),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData
    })
}