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

export const getAllUserHotels = async (page = 1, limit = 10, search?: string) => {
    const response = await axiosInstance.get('/users/hotels', {
        params: { page, limit, search },
    });
    return response.data;
};

export const getUserHotelById = async (hotelId: string) => {
    const response = await axiosInstance.get(`/users/hotels/${hotelId}`);
    return response.data;
};
