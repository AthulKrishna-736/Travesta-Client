import { createHotel } from "@/services/vendorService"
import { IHotel } from "@/types/user.types"
import { showError, showSuccess } from "@/utils/customToast"
import { useMutation } from "@tanstack/react-query"


export const UseCreateHotel = () => {
    return useMutation({
        mutationFn: (values: IHotel) => createHotel(values),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message || 'Something went wrong');
            }
        },
        onError: (error: any) => {
            console.log('error logging: ', error);
            showError(error.response.data.message || 'Something went wrong');
        }
    })
}