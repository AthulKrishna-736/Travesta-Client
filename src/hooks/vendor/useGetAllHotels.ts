import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAllHotels } from '@/services/vendorService';

export const useGetAllHotels = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ['vendor-hotels', page, limit, search],
        queryFn: () => getAllHotels(page, limit, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};
