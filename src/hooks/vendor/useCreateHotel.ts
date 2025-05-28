import { createHotel, updateHotel } from "@/services/vendorService"
import { showError, showSuccess } from "@/utils/customToast"
import { useMutation } from "@tanstack/react-query"


export const UseCreateHotel = (cbFn: () => void) => {
    return useMutation({
        mutationFn: (values: FormData) => createHotel(values),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message || 'Something went wrong');
            }
            cbFn()
        },
        onError: (error: any) => {
            console.log('error logging: ', error);
            showError(error.response.data.message || 'Something went wrong');
        }
    })
}


export const useUpdateHotel = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => updateHotel(id, data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
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