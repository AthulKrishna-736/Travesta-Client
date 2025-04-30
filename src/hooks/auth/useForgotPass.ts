import { forgotPass } from "@/services/authService";
import { TForgotPassValues } from "@/types/auth.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useForgotPass = (role: string, onSuccessCallback: (userId: string) => void) => {
    return useMutation({
        mutationFn: (values: TForgotPassValues) => forgotPass(values, role),
        onSuccess: (res) => {
            console.log('res on forgot pass: ', res)
            if (res.success) {
                showSuccess(res.message);
                onSuccessCallback(res.data);
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