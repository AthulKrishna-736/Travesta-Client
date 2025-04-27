import { resetPassword } from "@/services/authService";
import { TResetPassValues } from "@/types/Auth.Types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useResetPass = (role: string, onSuccessCallback: () => void) => {
    return useMutation({
        mutationFn: (values: TResetPassValues) => resetPassword(values, role),
        onSuccess: (res) => {
            console.log('res on resetpass: ',res)
            if (res.success) {
                showSuccess(res.message);
                onSuccessCallback()
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error.response?.data?.message || 'Something went wrong')
        }
    })
}