import { verifyOtp } from "@/services/authService";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";
import { OtpFormValues } from "@/types/Auth.Types";

export const useOtpVerify = (role: string, onSuccessCallback: () => void) => {
    return useMutation({
        mutationFn: (values: OtpFormValues) => verifyOtp(values, role),
        onSuccess: (data) => {
            if (data.success) {
                showSuccess(data.message)
                onSuccessCallback()
            } else {
                showError(data.message || 'OTP verification failed')
            }
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message)
        }
    })
}
