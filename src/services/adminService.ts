import { axiosInstance } from "./axiosInstance";


export const getAllUsers = async () => {
    const response = await axiosInstance.get(`/admin/users`);
    return response.data.data;
};

export const toggleBlockUser = async (userId: string) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/block-toggle`);
    return response.data;
};