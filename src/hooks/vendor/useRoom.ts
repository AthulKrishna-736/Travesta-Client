import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRoom, updateRoom, getRoomById, getRoomsByHotel, getAvailableRoomsByHotel, getAllRooms } from '@/services/vendorService';
import { showError, showSuccess } from '@/utils/customToast';

export const useCreateRoom = (cbFn: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => createRoom(formData),
        onSuccess: (res) => {
            console.log('room res: ', res)
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] });
                cbFn();
            } else {
                showError(res.message || 'Room creation failed');
            }
        },
        onError: (err: any) => {
            showError(err.response?.data?.message || 'Something went wrong');
        }
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


export const useGetAllRooms = () => {
    return useQuery({
        queryKey: ['vendor-rooms'],
        queryFn: getAllRooms,
        staleTime: 5 * 60 * 1000,
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
        enabled: !!hotelId
    });
};


export const useGetAvailableRoomsByHotel = (hotelId: string) => {
    return useQuery({
        queryKey: ['available-rooms', hotelId],
        queryFn: () => getAvailableRoomsByHotel(hotelId),
        enabled: !!hotelId
    });
};
