import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAllUserHotels, getUserHotelById } from '@/services/userService';

export const useGetAllUserHotels = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ['user-hotels', page, limit, search],
        queryFn: () => getAllUserHotels(page, limit, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};


export const useGetUserHotel = (hotelId: string) => {
    return useQuery({
        queryKey: ['userHotel', hotelId],
        queryFn: () => getUserHotelById(hotelId),
        enabled: !!hotelId, 
    });
};