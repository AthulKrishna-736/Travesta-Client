import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createHotel, getAllHotels, updateHotel } from "@/services/vendorService";
import { showError, showSuccess } from "@/utils/customToast";
import { getAllUserHotels, getUserHotelById } from '@/services/userService';

export const UseCreateHotel = (cbFn: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: FormData) => createHotel(values),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['vendor-hotels'] });
                cbFn();
            } else {
                showError(res.message || 'Something went wrong');
            }
        },
        onError: (error: any) => {
            console.log('error logging: ', error);
            showError(error.response?.data?.message || 'Something went wrong');
        }
    });
};

export const useUpdateHotel = (cbFn: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => updateHotel(id, data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['vendor-hotels'] });
                cbFn();
            } else {
                showError(res.message || 'Update failed');
            }
        },
        onError: (error: any) => {
            console.error('Update hotel error:', error);
            showError(error.response?.data?.message || 'Something went wrong');
        },
    });
};


export const useGetAllHotels = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ['vendor-hotels', page, limit, search],
        queryFn: () => getAllHotels(page, limit, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};

export const useGetAllUserHotels = (
    page: number,
    limit: number,
    filters: {
        search?: string;
        priceRange?: [number, number];
        selectedAmenities?: string[];
        roomType?: string[];
        checkIn?: string;
        checkOut?: string;
        guests?: number;
    } = {}
) => {
    return useQuery({
        queryKey: ['user-hotels', page, limit, filters],
        queryFn: () => getAllUserHotels(page, limit, filters),
        staleTime: 5 * 60 * 1000,
        // placeholderData: keepPreviousData,
    });
};


export const useGetUserHotel = (hotelId: string) => {
    return useQuery({
        queryKey: ['userHotel', hotelId],
        queryFn: () => getUserHotelById(hotelId),
        enabled: !!hotelId,
    });
};