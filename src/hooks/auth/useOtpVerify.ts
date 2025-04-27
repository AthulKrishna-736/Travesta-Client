import { verifyOtp } from "@/services/authService";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";
import { TOtpFormValues } from "@/types/Auth.Types";

export const useOtpVerify = (role: string, onSuccessCallback: (data: any) => void) => {
    return useMutation({
        mutationFn: (values: TOtpFormValues) => verifyOtp(values, role),
        onSuccess: (data) => {
            if (data.success) {
                showSuccess(data.message)
                onSuccessCallback(data)
            } else {
                showError(data.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message || 'Something went wrong')
        }
    })
}
