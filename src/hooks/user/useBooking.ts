import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelBooking, confirmBooking, createBooking, getCustomDates, getUserBookings } from '@/services/userService';
import { showError, showSuccess } from '@/utils/customToast';
import { getBookingsToVendor } from '@/services/vendorService';
import { ICustomError } from '@/types/custom.types';
import { TCustomCalendarItem } from '@/components/common/CustomCalendar';

export const useGetUserBookings = (page: number, limit: number, search?: string, sort?: string) => {
    return useQuery({
        queryKey: ["user-bookings", { page, search, sort }],
        queryFn: () => getUserBookings(page, limit, search, sort),
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
};

export const useGetVendorBookings = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['vendor-bookings', page],
        queryFn: () => getBookingsToVendor(page, limit),
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
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

export const useGetCustomDate = (roomId: string, checkIn: string, checkOut: string, limit: number) => {
    return useQuery<TCustomCalendarItem[]>({
        queryKey: ['custom-dates'],
        queryFn: () => getCustomDates(roomId, checkIn, checkOut, limit),
        staleTime: 60 * 1000,
        placeholderData: keepPreviousData,
        retry: 1,
    })
}