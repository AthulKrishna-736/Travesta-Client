import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHotel, updateHotel } from "@/services/vendorService";
import { showError, showSuccess } from "@/utils/customToast";

export const UseCreateHotel = (page: number, limit: number, cbFn: () => void, search?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: FormData) => createHotel(values),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['vendor-hotels', page, limit, search] });
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

export const useUpdateHotel = (cbFn: () => void, page: number, limit: number, search?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => updateHotel(id, data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['vendor-hotels', page, limit, search] });
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
