import { resetPassword } from "@/services/authService";
import { TResetPassValues } from "@/types/Auth.Types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useResetPass = (role: string, onSuccessCallback: () => void) => {
    return useMutation({
        mutationFn: (values: TResetPassValues) => resetPassword(values, role),
        onSuccess: (data) => {
            if (data.success) {
                showSuccess(data.message);
                onSuccessCallback()
            } else {
                showError(data.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            showError(error.response?.data?.message || 'Something went wrong')
        }
    })
}