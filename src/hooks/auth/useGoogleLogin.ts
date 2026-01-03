import { googleLogin } from "@/services/authService";
import { setUser } from "@/store/slices/userSlice";
import { setVendor } from "@/store/slices/vendorSlice";
import { AppDispatch, RootState } from "@/store/store";
import { TGoogleLoginValues } from '../../types/authentication.types';
import { ICustomError } from "@/types/custom.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { clearLastVisitedPath } from "@/store/slices/navigationSlice";

export const useGoogleLogin = (role: string) => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();

    const lastVisitedPath = useSelector((state: RootState) => state.navigation.lastVisitedPath);

    return useMutation({
        mutationFn: (values: TGoogleLoginValues) => googleLogin(values, role),
        onSuccess: (res) => {
            if (res.success) {
                if (role === 'user') {
                    dispatch(setUser(res.data))
                    if (lastVisitedPath) {
                        window.location.href = lastVisitedPath;
                        dispatch(clearLastVisitedPath());
                    } else {
                        navigate("/user/home");
                    }
                } else {
                    dispatch(setVendor(res.data))
                    navigate('/vendor/home')
                }
                showSuccess(res.message)
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: ICustomError) => {
            console.log('error logging: ', error)
            showError(error.response?.data?.message || 'Something went wrong');
        }
    })
}