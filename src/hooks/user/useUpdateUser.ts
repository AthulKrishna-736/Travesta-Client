import { updateUser } from "@/services/userService";
import { setUser } from "@/store/slices/authSlice";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";


export const useUpdateUser = () => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (values: { data: FormData }) => updateUser(values.data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
                // dispatch(setUser(res.data.user))
                queryClient.invalidateQueries({ queryKey: ['user'] });
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