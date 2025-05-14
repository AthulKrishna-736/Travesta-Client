import { updateVendor } from "@/services/vendorService";
import { setVendor } from "@/store/slices/vendorSlice";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";


export const useUpdateUser = () => {
    const dispatch = useDispatch()

    return useMutation({
        mutationFn: (values: { data: FormData }) => updateVendor(values.data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
                dispatch(setVendor(res.data.user))
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error?.response?.data?.message || 'Something went wrong')
        }
    })
}