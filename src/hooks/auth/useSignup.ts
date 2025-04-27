import { register } from "@/services/authService";
import { TSignUpFormValues } from "@/types/Auth.Types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useSignup = (role: string, onSuccessCallback: (userId: string) => void) => {
    return useMutation({
        mutationFn: (values: TSignUpFormValues) => register(values, role),
        onSuccess: (res) => {
            console.log('data on response: ', res)
            if (res.success && res.data?.userId) {
                showSuccess(res.message)
                onSuccessCallback(res.data?.userId)
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