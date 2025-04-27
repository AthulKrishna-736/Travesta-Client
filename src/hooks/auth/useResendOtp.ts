import { resendOtp } from "@/services/authService";
import { TResentOtpValues } from "@/types/Auth.Types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useResendOtp = (role: string, onSuccessCallback: () => void) => {
    return useMutation({
        mutationFn: (values: TResentOtpValues) => resendOtp(values, role),
        onSuccess: (data) => {
            if (data.success) {
                showSuccess(data.message || 'Otp resend successfully!');
                onSuccessCallback()
            } else {
                showError(data.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message || 'Something went wrong')
        }
    })
}