import { uplodKyc } from "@/services/vendorService";
import { setVendor } from "@/store/slices/vendorSlice";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";


export const useKycUpload = () => {
    const dispatch = useDispatch()

    return useMutation({
        mutationFn: (values: { data: FormData }) => uplodKyc(values.data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
                dispatch(setVendor(res.data))
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