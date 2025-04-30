import { toggleBlockUser } from "@/services/adminService";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useBlockUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => toggleBlockUser(userId),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
                queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error.response?.data?.message || 'Something went wrong')
        }
    })
}