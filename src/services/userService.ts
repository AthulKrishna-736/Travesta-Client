import { axiosInstance } from "./axiosInstance"


export const getUser = async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
}

export const updateUser = async (formData: FormData) => {
    const response = await axiosInstance.patch(`/users/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const getChatMessages = async (userId: string) => {
    const { data } = await axiosInstance.get(`/users/chat/${userId}`);
    return data;
};
