import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelBooking, confirmBooking, createBooking, getUserBookings } from '@/services/userService';
import { showError, showSuccess } from '@/utils/customToast';
import { getBookingsToVendor, getVendorAnalytics } from '@/services/vendorService';
import { ICustomError } from '@/types/custom.types';

export const useGetUserBookings = (page: number, limit: number, search?: string, sort?: string) => {
    return useQuery({
        queryKey: ["user-bookings", { page, search, sort }],
        queryFn: () => getUserBookings(page, limit, search, sort),
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
        retry: 2,
    });
};

export const useGetVendorBookings = (page: number, limit: number, hotelId?: string, startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['vendor-bookings', { page, limit, hotelId, startDate, endDate }],
        queryFn: () => getBookingsToVendor(page, limit, hotelId, startDate, endDate),
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
        retry: 2,
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookingId: string) => cancelBooking(bookingId),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
            } else {
                showError(res.message || 'Something went wrong');
            }
            queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
        },
        onError: (error: ICustomError) => {
            console.error('Cancel booking error:', error);
            showError(error.response.data.message || 'Failed to cancel booking');
        },
    });
};

export const useCreateBooking = () => {
    return useMutation({
        mutationFn: createBooking,
        onSuccess: (res) => {
            showSuccess(res?.message || 'Booking successful!');
        },
        onError: (error: ICustomError) => {
            const msg = error.response.data.message || 'Booking failed. Try again.';
            showError(msg);
        },
    });
};

export const useConfirmBooking = (
    vendorId: string,
    method: 'wallet' | 'online') => {
    return useMutation({
        mutationFn: (data: { hotelId: string, roomId: string, checkIn: string, checkOut: string, guests: number, totalPrice: number }) => confirmBooking(vendorId, data, method),
        onSuccess: (res) => {
            showSuccess(res?.message || 'Booking confirmed!');
        },
        onError: (error: ICustomError) => {
            const msg = error.response.data.message || 'Booking failed. Try again.';
            showError(msg);
        },
    });
}

export const useGetVendorAnalytics = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['analytics', { startDate, endDate }],
        queryFn: () => getVendorAnalytics(startDate, endDate),
        staleTime: 5 * 60 * 1000,
        retry: 2,
        placeholderData: keepPreviousData,
    })
}