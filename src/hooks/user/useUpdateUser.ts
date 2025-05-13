import { updateUser } from "@/services/userService";
import { setUser } from "@/store/slices/authSlice";
import { UpdateUser } from "@/types/user.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";


export const useUpdateUser = () => {
    const dispatch = useDispatch()

    return useMutation({
        mutationFn: (values: { data: Omit<UpdateUser, 'isVerified'> }) => updateUser(values.data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
                dispatch(setUser(res.data))
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