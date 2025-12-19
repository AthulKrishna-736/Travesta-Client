import { register } from "@/services/authService";
import { TSignUpFormValues } from '../../types/auth.types';
import { ICustomError } from "@/types/custom.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useSignup = (role: string, onSuccessCallback: (userId: string) => void) => {
    return useMutation({
        mutationFn: (values: TSignUpFormValues) => register(values, role),
        onSuccess: (res) => {
            if (res.success && res.data?.userId) {
                showSuccess(res.message)
                onSuccessCallback(res.data?.userId)
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: ICustomError) => {
            console.log('error logging: ', error)
            showError(error.response.data.message || 'Something went wrong')
        }
    })
}