import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRoom, updateRoom, getRoomById, getRoomsByHotel, getAvailableRoomsByHotel, getAllRooms, getAvailableRooms } from '@/services/vendorService';
import { showError, showSuccess } from '@/utils/customToast';

export const useCreateRoom = (cbFn: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => createRoom(formData),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] });
                cbFn();
            } else {
                showError(res.message || 'Room creation failed');
            }
        },
        onError: (err: any) => {
            const res = err.response?.data;
            if (res?.message) {
                showError(res.message);
            }

            if (res?.error && typeof res.error === 'object') {
                Object.entries(res.error).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => showError(`${field}: ${msg}`));
                    } else {
                        showError(`${field}: ${messages}`);
                    }
                });
            }
        },
    });
};


export const useUpdateRoom = (cbFn: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: { id: string, formData: FormData }) => updateRoom(id, formData),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] });
                cbFn();
            } else {
                showError(res.message || 'Room update failed');
            }
        },
        onError: (err: any) => {
            showError(err.response?.data?.message || 'Something went wrong');
        }
    });
};


export const useGetAllRooms = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ['hotel-rooms', page, limit, search],
        queryFn: async () => {
            try {
                return await getAllRooms(page, limit, search);
            } catch (error: any) {
                const msg = error?.response?.data?.message || 'Failed to fetch rooms';
                showError(msg);
                return { data: [], meta: { currentPage: 1, totalPages: 1 } };
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: false,

    });
};


export const useGetRoomById = (roomId: string) => {
    return useQuery({
        queryKey: ['room', roomId],
        queryFn: () => getRoomById(roomId),
        enabled: !!roomId
    });
};


export const useGetRoomsByHotel = (hotelId: string) => {
    return useQuery({
        queryKey: ['hotel-rooms', hotelId],
        queryFn: () => getRoomsByHotel(hotelId),
        enabled: !!hotelId,
        staleTime: 5 * 60 * 1000,
    });
};


export const useGetAvailableRoomsByHotel = (hotelId: string) => {
    return useQuery({
        queryKey: ['available-rooms', hotelId],
        queryFn: () => getAvailableRoomsByHotel(hotelId),
        enabled: !!hotelId
    });
};

export const useGetAvailableRooms = (
  page: number,
  limit: number,
  priceRange: [number, number],
  amenities: string[],
  search?: string,
  checkIn?: string,
  checkOut?: string,
  guests?: number
) => {
  return useQuery({
    queryKey: ['available-rooms', page, limit, search, priceRange, amenities, checkIn, checkOut, guests],
    queryFn: () => getAvailableRooms(page, limit, priceRange, amenities, search, checkIn, checkOut, guests),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

