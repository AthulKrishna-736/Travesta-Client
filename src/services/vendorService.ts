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
    const response = await axiosInstance.get(`/vendor/rooms/by-hotel/${hotelId}`);
    return response.data;
};

export const getAvailableRoomsByHotel = async (hotelId: string) => {
    const response = await axiosInstance.get(`/vendor/hotels/${hotelId}/rooms/available`);
    return response.data;
};

export const getAvailableRooms = async (
    page: number,
    limit: number,
    priceRange?: [number, number],
    amenities?: string[],
    search?: string,
    checkIn?: string,
    checkOut?: string,
    guests?: number
) => {
    const params: Record<string, any> = {
        page,
        limit,
    };

    if (search) params.search = search;
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    if (guests) params.guests = guests;
    if (priceRange?.length === 2) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
    }

    if (amenities && amenities.length > 0) {
        params.amenities = amenities.join(',');
    }

    const response = await axiosInstance.get(`/vendor/rooms/available`, {
        params,
    });

    return response.data;
};


export const getChatUsers = async (search?: string): Promise<Pick<User, 'id' | 'firstName' | 'role'>[] | null> => {
    const response = await axiosInstance.get('/vendor/chat-users', {
        params: { search },
    });
    return response.data?.data;
}

export const getBookingsToVendor = async (page: number, limit: number) => {
    const response = await axiosInstance.get('/vendor/bookings', {
        params: { page, limit },
    });
    return response.data;
};
