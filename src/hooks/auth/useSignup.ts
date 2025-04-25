import { register } from "@/services/authService";
import { SignUpFormValues } from "@/types/Auth.Types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useSignup = (role: string, onSuccessCallback: (userId: string) => void) => {
    return useMutation({
        mutationFn: (values: SignUpFormValues) => register(values, role),
        onSuccess: (data) => {
            if (data.success && data?.userId) {
                showSuccess(data.message)
                onSuccessCallback(data?.userId)
            } else {
                showError('Something went wrong')
            }
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message)
        }
    })
}