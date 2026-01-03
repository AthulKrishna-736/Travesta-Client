import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createHotel, getHotelAnalytics, getHotelByVendor, getHotelsByVendor, getTrendingHotels, updateHotel } from "@/services/vendorService";
import { showError, showSuccess } from "@/utils/customToast";
import { getAllUserHotels, getHotelDetailsWithRoom, getUserHotelBySlug } from '@/services/userService';
import { ICustomError } from '@/types/custom.types';

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
        onError: (error: ICustomError) => {
            console.log('error logging: ', error);
            showError(error.response.data.message || 'Something went wrong');
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
        onError: (error: ICustomError) => {
            console.error('Update hotel error:', error);
            showError(error.response.data.message || 'Something went wrong');
        },
    });
};


export const useHotelsByVendor = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ['vendor-hotels', { page, limit, search }],
        queryFn: () => getHotelsByVendor(page, limit, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });
};

export const useHotelByVendor = (hotelId: string) => {
    return useQuery({
        queryKey: ['vendor-hotel', hotelId],
        queryFn: () => getHotelByVendor(hotelId),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    })
}

export const useGetHotelDetailsWithRoom = (hotelId: string, roomId: string, checkIn: string, checkOut: string, rooms: number, adults: number, children: number) => {
    return useQuery({
        queryKey: ['hotel-details', { hotelId, roomId, checkIn, checkOut, rooms, adults, children }],
        queryFn: () => getHotelDetailsWithRoom(hotelId, roomId, checkIn, checkOut, rooms, adults, children),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        retry: 1,
    });
};

export const useGetAllUserHotels = (
    page: number,
    limit: number,
    lat: number,
    long: number,
    rooms: number,
    filters: {
        search?: string;
        priceRange?: [number, number];
        selectedAmenities?: string[];
        roomType?: string[];
        rating?: number;
        checkIn?: string;
        checkOut?: string;
        guests?: number;
        sort?: string;
    } = {}
) => {
    return useQuery({
        queryKey: ['user-hotels', { page, limit, lat, long, rooms, filters }],
        queryFn: () => getAllUserHotels(page, limit, lat, long, rooms, filters),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });
};

export const useGetHotelBySlug = (hotelSlug: string) => {
    return useQuery({
        queryKey: ['hotel', hotelSlug],
        queryFn: () => getUserHotelBySlug(hotelSlug),
        enabled: !!hotelSlug,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        retry: 1,
    })
}

export const useGetHotelAnalytics = (hotelId: string, period: 'week' | 'month' | 'year') => {
    return useQuery({
        queryKey: ['hotel-analytics', { hotelId, period }],
        queryFn: () => getHotelAnalytics(hotelId, period),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        retry: 2,
    })
}

export const useGetTrendingHotels = () => {
    return useQuery({
        queryKey: ['trending-hotels'],
        queryFn: getTrendingHotels,
        staleTime: 6 * 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });
}