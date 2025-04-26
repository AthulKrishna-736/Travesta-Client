import { resendOtp } from "@/services/authService";
import { ResentOtpValues } from "@/types/Auth.Types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useResendOtp = (role: string, onSuccessCallback: () => void) => {
    return useMutation({
        mutationFn: (values: ResentOtpValues) => resendOtp(values, role),
        onSuccess: (data) => {
            if (data.success) {
                showSuccess(data.message || 'Otp resend successfully!');
                onSuccessCallback()
            } else {
                showError(data.message || 'Resend otp failed')
            }
        },
        onError: (error: any) => {
            showError(error.response?.data?.message)
        }
    })
}