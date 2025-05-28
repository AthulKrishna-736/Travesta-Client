import { toggleBlockUser } from "@/services/adminService";
import { TRoles } from "@/types/Auth.Types";
import { TGetAllUsersResponse } from "@/types/response.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useBlockUser = (page: number, limit: number, role: TRoles, search: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => toggleBlockUser(userId),
        onMutate: async (userId: string) => {
            await queryClient.cancelQueries({ queryKey: ['admin-users', page, limit, role, search] });

            const prevUsers = queryClient.getQueryData(['admin-users', page, limit, role, search]);

            queryClient.setQueryData(['admin-users', page, limit, role, search], (oldData: TGetAllUsersResponse) => {
                return {
                    ...oldData,
                    data: oldData?.data?.map((user) => {
                        if (user.id == userId) {
                            user.isBlocked = !user.isBlocked
                        }
                        return user
                    })
                }
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
                queryClient.setQueryData(['admin-users', page, limit, role, search], context.prevUsers);
            }

            console.log('error logging: ', error)
            showError(error.response?.data?.message || 'Something went wrong')
        },
    })
}