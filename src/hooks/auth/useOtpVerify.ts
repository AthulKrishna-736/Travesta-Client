import { verifyOtp } from "@/services/authService";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";
import { TOtpFormValues } from "@/types/Auth.Types";

export const useOtpVerify = (role: string, onSuccessCallback: (data: any) => void) => {
    return useMutation({
        mutationFn: (values: TOtpFormValues) => verifyOtp(values, role),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
                if (res.data?.email) {
                    onSuccessCallback(res.data?.email)
                } else {
                    showError('Email not found after Otp verification');
                }
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
