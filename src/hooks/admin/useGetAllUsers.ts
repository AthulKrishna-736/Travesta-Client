import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@/services/adminService';

export const useGetAllUsers = () => {
    return useQuery({
        queryKey: ['admin-users'],
        queryFn: getAllUsers,
        staleTime: 5 * 60 * 1000,
    });
};
