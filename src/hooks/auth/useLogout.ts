import { logout } from "@/services/authService";
import { logoutAdmin } from "@/store/slices/adminSlice";
import { logoutUser } from "@/store/slices/authSlice";
import { logoutVendor } from "@/store/slices/vendorSlice";
import { AppDispatch } from "@/store/store";
import { TRoles } from "@/types/Auth.Types";
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
            console.log('Logput success:', res)
            if (res.success) {
                if (role === 'admin') {
                    dispatch(logoutAdmin())
                } else if (role === 'vendor') {
                    dispatch(logoutVendor())
                } else {
                    dispatch(logoutUser())
                }
                showSuccess(res.message)
                navigate(`/${role}/login`)
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