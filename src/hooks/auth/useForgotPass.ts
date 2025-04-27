import { forgotPass } from "@/services/authService";
import { TForgotPassValues } from "@/types/Auth.Types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useForgotPass = (role: string, onSuccessCallback: (userId: string) => void) => {
    return useMutation({
        mutationFn: (values: TForgotPassValues) => forgotPass(values, role),
        onSuccess: (data) => {
            if (data.success) {
                showSuccess(data.message);
                onSuccessCallback(data.data);
            } else {
                showError(data.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message || 'Something went wrong')
        }
    })
}