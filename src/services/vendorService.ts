import { axiosInstance } from "./axiosInstance"
import { User } from "@/types/user.types";

export const getVendor = async () => {
    const response = await axiosInstance.get('/vendor/profile');
    return response.data;
}

export const updateVendor = async (formData: FormData) => {
    const response = await axiosInstance.patch(`/vendor/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const uplodKyc = async (formData: FormData) => {
    const response = await axiosInstance.patch('/vendor/kyc', formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data
}

export const getChatUsers = async (search?: string): Promise<Pick<User, 'id' | 'firstName' | 'role'>[] | null> => {
    const response = await axiosInstance.get('/vendor/chat-users', {
        params: { search },
    });
    return response.data?.data;
}