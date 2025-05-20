import { getVendors } from "@/services/adminService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetVendors = (page: number, limit: number, search?: string)=> {
    return useQuery({
        queryKey: ['admin-vendor', page, limit, search],
        queryFn: () => getVendors(page, limit, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData
    })
}