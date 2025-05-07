import { GetAllUsersResponse } from "@/types/response.types";
import { axiosInstance } from "./axiosInstance";


export const getAllUsers = async (page = 1, limit = 10, role: string): Promise<GetAllUsersResponse> => {
    const response = await axiosInstance.get(`/admin/users`, { params: { page, limit, role } });
    return response.data
};

export const toggleBlockUser = async (userId: string) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/block-toggle`);
    return response.data;
};