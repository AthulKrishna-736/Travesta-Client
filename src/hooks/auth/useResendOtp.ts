import { resendOtp } from "@/services/authService";
import { TResentOtpValues } from "@/types/auth.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

export const useResendOtp = (role: string, purpose: 'signup' | 'reset', onSuccessCallback: () => void) => {
    return useMutation({
        mutationFn: (values: TResentOtpValues) => {
            const payload = { ...values, purpose }
            return resendOtp(payload, role)
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message || 'Otp resend successfully!');
                onSuccessCallback()
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