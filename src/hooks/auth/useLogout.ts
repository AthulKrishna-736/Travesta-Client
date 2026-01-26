import { logout } from "@/services/authService";
import { logoutUser } from "@/store/slices/userSlice";
import { AppDispatch } from "@/store/store";
import { TRoles } from '../../types/authentication.types';
import { ICustomError } from "@/types/custom.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


export const useLogout = (role: TRoles) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()

    return useMutation({
        mutationFn: () => logout(role),
        onSuccess: (res) => {
            if (res.success) {
                dispatch(logoutUser())
                showSuccess(res.message)
                navigate(`/${role}/login`);
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: ICustomError) => {
            console.log('error logging: ', error)
            showError(error.response.data.message || 'Something went wrong')
        }
    })
}