import { TResponseChat } from "@/types/chat.types";
import { VENDOR_APIS } from "./apiConstants";
import { axiosInstance } from "./axiosInstance"
import { User } from "@/types/user.types";


//vendor profile
export const getVendor = async () => {
    const response = await axiosInstance.get(`${VENDOR_APIS.profile}`);
    return response.data;
}

export const updateVendor = async (formData: FormData) => {
    const response = await axiosInstance.put(`${VENDOR_APIS.profile}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const uplodKyc = async (formData: FormData) => {
    const response = await axiosInstance.patch(`${VENDOR_APIS.profile}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data
}

//wallet
export const getVendorTransactions = async (page: number, limit: number) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.transactions}`, {
        params: { page, limit },
    });
    return response.data;
}

//vendor hotels
export const createHotel = async (formData: FormData) => {
    const response = await axiosInstance.post(`${VENDOR_APIS.hotels}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data;
}

export const getHotelByVendor = async (hotelId: string) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.hotel}/${hotelId}`);
    return response.data;
};

export const getHotelsByVendor = async (page: number, limit: number, search?: string) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.hotels}`, {
        params: { page, limit, search },
    });
    return response.data;
};

export const updateHotel = async (id: string, formData: FormData) => {
    const response = await axiosInstance.put(`${VENDOR_APIS.hotels}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getHotelAnalytics = async (hotelId: string, period: 'week' | 'month' | 'year') => {
    const response = await axiosInstance.get(`${VENDOR_APIS.hotel}/${hotelId}/analytics`, {
        params: { period: period }
    });
    return response.data;
}

//rooms
export const getAllRooms = async (page: number, limit: number, search?: string, hotelId?: string) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.rooms}`, {
        params: { page, limit, search, hotelId }
    });
    return response.data;
};

export const createRoom = async (formData: FormData) => {
    const response = await axiosInstance.post(`${VENDOR_APIS.rooms}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateRoom = async (roomId: string, formData: FormData) => {
    const response = await axiosInstance.patch(`${VENDOR_APIS.rooms}/${roomId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getRoomById = async (roomId: string) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.rooms}/${roomId}`);
    return response.data;
};

export const getRoomsByHotel = async (hotelId: string, checkIn: string, checkOut: string) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.rooms}/by-hotel/${hotelId}`, {
        params: { checkIn, checkOut },
    });
    return response.data;
};

export const getAvailableRoomsByHotel = async (hotelId: string) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.hotels}/${hotelId}/rooms/available`);
    return response.data;
};

export const getAvailableRooms = async (
    page: number,
    limit: number,
    priceRange?: [number, number],
    amenities?: string[],
    roomTypes?: string[],
    search?: string,
    checkIn?: string,
    checkOut?: string,
    guests?: number
) => {
    const params: Record<string, any> = { page, limit };

    if (search) params.search = search;
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    if (guests) params.guests = guests;

    if (priceRange?.length === 2) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
    }

    if (amenities?.length) {
        params.amenities = amenities.join(",");
    }

    if (roomTypes?.length) {
        params.roomTypes = roomTypes.join(",");
    }

    const { data } = await axiosInstance.get(`${VENDOR_APIS.rooms}/available`, { params });
    return data;
};

//amenities
export const getVendorAmenities = async () => {
    const response = await axiosInstance.get(`${VENDOR_APIS.amenities}`);
    return response.data;
}


//chat
export const getChattedCustomers = async (search?: string): Promise<Pick<User, 'id' | 'firstName' | 'role'>[] | null> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.chat}/vendors`, {
        params: { search }
    });
    return response.data?.data
};

export const getVendorChatMessages = async (userId: string): Promise<TResponseChat[] | null> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.chat}/${userId}/messages`);
    return response.data?.data;
};

export const getVendorUnreadChats = async () => {
    const response = await axiosInstance.get(`${VENDOR_APIS.chat}/unread`);
    return response.data;
};


export const getBookingsToVendor = async (page: number, limit: number, hotelId?: string, startDate?: string, endDate?: string) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.booking}`, {
        params: { page, limit, hotelId, startDate, endDate },
    });
    return response.data;
};


export const getVendorAnalytics = async (startDate?: string, endDate?: string) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.analytics}`, {
        params: { startDate, endDate },
    });
    return response.data;
}