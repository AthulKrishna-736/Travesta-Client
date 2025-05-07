import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAllUsers } from '@/services/adminService';

export const useGetAllUsers = (page: number, limit: number, role: string) => {
    return useQuery({
        queryKey: ['admin-users', page, limit, role],
        queryFn: () => getAllUsers(page, limit, role),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};
