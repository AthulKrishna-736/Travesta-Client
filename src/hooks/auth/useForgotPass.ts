import { forgotPass } from "@/services/authService";
import { TForgotPassValues } from "@/types/auth.types";
import { ICustomError } from "@/types/custom.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useForgotPass = (role: string, onSuccessCallback: (userId: string) => void) => {
    return useMutation({
        mutationFn: (values: TForgotPassValues) => {
            const payload = {
                ...values,
                role
            }
            return forgotPass(payload, role)
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                onSuccessCallback(res.data);
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: ICustomError) => {
            console.log('error logging: ', error)
            showError(error?.response?.data?.message || 'Something went wrong')
        }
    })
}