import { toggleBlockUser } from "@/services/adminService";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useBlockUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => toggleBlockUser(userId),
        onMutate: async (userId: string) => {
            await queryClient.cancelQueries({ queryKey: ['admin-users'] });

            const prevUsers = queryClient.getQueryData<any[]>(['admin-users']);

            queryClient.setQueryData(['admin-users'], (oldUsers: any[] | undefined) => {
                return oldUsers?.map(user =>
                    user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
                );
            });

            return { prevUsers }
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: any, _userId, context) => {
            if (context?.prevUsers) {
                queryClient.setQueryData(['admin-users'], context.prevUsers);
            }

            console.log('error logging: ', error)
            showError(error.response?.data?.message || 'Something went wrong')
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
        }
    })
}