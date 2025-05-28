import { axiosInstance } from "./axiosInstance"

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

export const createHotel = async (formData: FormData) => {
    const response = await axiosInstance.post('/vendor/hotels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data;
}

export const getAllHotels = async (page = 1, limit = 10, search?: string) => {
    const response = await axiosInstance.get('/vendor/hotels', {
        params: { page, limit, search },
    });
    return response.data;
};

export const updateHotel = async (id: string, formData: FormData) => {
    const response = await axiosInstance.patch(`/vendor/hotels/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};