import { googleLogin } from "@/services/authService";
import { setUser } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { TGoogleLoginValues } from "@/types/Auth.Types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useGoogleLogin = (role: string) => {
    const dispatch = useDispatch<AppDispatch>();

    return useMutation({
        mutationFn: (values: TGoogleLoginValues) => googleLogin(values, role),
        onSuccess: (res) => {
            console.log('res on googleLogin: ', res)
            if (res.success) {
                dispatch(setUser(res.data))
                showSuccess(res.message)
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error.response?.data?.message || 'Something went wrong');
        }
    })
}