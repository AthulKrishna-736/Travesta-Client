import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUser, updateUser } from "@/services/userService"
import { useDispatch } from "react-redux"
import { showError, showSuccess } from "@/utils/customToast"
import { setUser } from "@/store/slices/userSlice"
import { getAllUsers, toggleBlockUser } from "@/services/adminService"
import { TGetAllUsersResponse } from "@/types/response.types"
import { TRoles } from "@/types/Auth.Types"

export const useGetUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}

export const useUpdateUser = () => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (values: { data: FormData }) => updateUser(values.data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
                dispatch(setUser(res.data.user))
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

export const useGetAllUsers = (page: number, limit: number, role: string, search?: string) => {
    return useQuery({
        queryKey: ['admin-users', page, limit, role, search],
        queryFn: () => getAllUsers(page, limit, role, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};

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