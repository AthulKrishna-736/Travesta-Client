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

export const getAllHotels = async (page: number, limit: number, search?: string) => {
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

export const getAllRooms = async (page: number, limit: number, search?: string) => {
    const response = await axiosInstance.get('/vendor/rooms', {
        params: { page, limit, search }
    });
    return response.data;
};

export const createRoom = async (formData: FormData) => {
    const response = await axiosInstance.post('/vendor/rooms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateRoom = async (roomId: string, formData: FormData) => {
    const response = await axiosInstance.patch(`/vendor/rooms/${roomId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getRoomById = async (roomId: string) => {
    const response = await axiosInstance.get(`/vendor/rooms/${roomId}`);
    return response.data;
};

export const getRoomsByHotel = async (hotelId: string) => {
    const response = await axiosInstance.get(`/vendor/hotels/${hotelId}/rooms`);
    return response.data;
};

export const getAvailableRoomsByHotel = async (hotelId: string) => {
    const response = await axiosInstance.get(`/vendor/hotels/${hotelId}/rooms/available`);
    return response.data;
};
