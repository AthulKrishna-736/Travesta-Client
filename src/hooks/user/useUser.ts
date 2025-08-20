import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUser, updateUser } from "@/services/userService"
import { useDispatch } from "react-redux"
import { showError, showSuccess } from "@/utils/customToast"
import { setUser } from "@/store/slices/userSlice"
import { getAllUsers, toggleBlockUser } from "@/services/adminService"
import { TGetAllUsersResponse } from "@/types/response.types"
import { TSortOption } from "@/types/custom.types"

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

export const useGetAllUsers = (page: number, limit: number, role: string, search?: string, sortOption?: TSortOption) => {
    return useQuery({
        queryKey: ['admin-users', { page, limit, role, search, sortOption }],
        queryFn: () => getAllUsers(page, limit, role, search, sortOption),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};

export const useBlockUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => toggleBlockUser(userId),
        onMutate: async (userId: string) => {
            await queryClient.cancelQueries({ queryKey: ['admin-users'], exact: false });

            const allQueries = queryClient.getQueriesData<TGetAllUsersResponse>({ queryKey: ['admin-users'] });


            allQueries.forEach(([key, _]) => {
                queryClient.setQueryData(key, (prev: TGetAllUsersResponse) => ({
                    ...prev,
                    data: prev?.data?.map(user =>
                        user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
                    ),
                }));
            });

            return { allQueries };
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: any, _userId, context) => {
            if (context?.allQueries) {
                context.allQueries.forEach(([key, oldData]) => {
                    queryClient.setQueryData(key, oldData);
                });
            }

            console.log('error logging: ', error)
            showError(error.response?.data?.message || 'Something went wrong')
        },
    })
}