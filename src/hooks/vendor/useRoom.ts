import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRoom, updateRoom, getRoomById, getAllRooms } from '@/services/vendorService';
import { showError, showSuccess } from '@/utils/customToast';
import { ICustomError } from '@/types/custom.types';
import { getUserRoomById } from '@/services/userService';

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
        onError: (err: ICustomError) => {
            const res = err.response.data;
            if (res?.message) {
                showError(res.message);
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
        onError: (err: ICustomError) => {
            showError(err.response?.data?.message || 'Something went wrong');
        }
    });
};


export const useGetAllRooms = (page: number, limit: number, search?: string, hotelId?: string) => {
    return useQuery({
        queryKey: ['hotel-rooms', { page, limit, search, hotelId }],
        queryFn: async () => {
            try {
                return await getAllRooms(page, limit, search, hotelId);
            } catch (error) {
                const msg = 'Failed to fetch rooms';
                console.log('error: ', error);
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
        queryKey: ['room-vendor', roomId],
        queryFn: () => getRoomById(roomId),
        enabled: !!roomId,
        placeholderData: (prev) => prev,
        retry: 1,
    });
};


export const useGetUserRoomById = (roomId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['user-room', roomId],
        queryFn: () => getUserRoomById(roomId),
        enabled,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

