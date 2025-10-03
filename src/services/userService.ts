import { TResponseChat } from "@/types/chat.types";
import { axiosInstance } from "./axiosInstance"
import { User } from "@/types/user.types";
import { BookingPayload } from "@/types/booking.types";
import { USER_APIS } from "./apiConstants";

//user profile
export const getUser = async () => {
    const response = await axiosInstance.get(`${USER_APIS.profile}`);
    return response.data;
}

export const updateUser = async (formData: FormData) => {
    const response = await axiosInstance.put(`${USER_APIS.profile}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

//hotel
export const getAllUserHotels = async (
    page: number = 1,
    limit: number = 9,
    filters: {
        search?: string;
        priceRange?: [number, number];
        selectedAmenities?: string[];
        roomType?: string[];
        checkIn?: string;
        checkOut?: string;
        guests?: number;
        sort?: string;
    } = {}
) => {
    const { search, priceRange, selectedAmenities, roomType, checkIn, checkOut, guests, sort } = filters;

    const params: any = { page, limit, search, checkIn, checkOut, guests, };

    if (priceRange) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
    }

    if (selectedAmenities?.length) {
        params.amenities = selectedAmenities.join(',');
    }

    if (roomType?.length) {
        params.roomType = roomType.join(',');
    }

    if (sort) {
        params.sort = sort;
    }

    const response = await axiosInstance.get(`${USER_APIS.hotels}`, { params });
    return response.data;
};


export const getUserHotelById = async (hotelId: string) => {
    const response = await axiosInstance.get(`${USER_APIS.hotels}/${hotelId}`);
    return response.data;
};

//room
export const getCustomDates = async (roomId: string, checkIn: string, checkOut: string, limit: number) => {
    const response = await axiosInstance.get(`${USER_APIS.customRoomDates}`, {
        params: { roomId, checkIn, checkOut, limit }
    })
    return response.data;
}

//amenities
export const getUserAmenities = async () => {
    const response = await axiosInstance.get(`${USER_APIS.amenities}`);
    return response.data;
}

//chat
export const getChattedVendors = async (search?: string): Promise<Pick<User, 'id' | 'firstName' | 'role'>[] | null> => {
    const response = await axiosInstance.get(`${USER_APIS.chat}/vendors`, {
        params: { search }
    })
    return response.data?.data
};

export const getUserChatMessages = async (userId: string): Promise<TResponseChat[] | null> => {
    const response = await axiosInstance.get(`${USER_APIS.chat}/${userId}/messages`);
    return response.data?.data;
};

export const getUserUnreadChats = async () => {
    const response = await axiosInstance.get(`${USER_APIS.chat}/unread`);
    return response.data;
};

export const getUserChatAccess = async () => {
    const response = await axiosInstance.get(`${USER_APIS.access}`);
    return response.data;
}

//booking
export const getUserBookings = async (page: number, limit: number, search?: string, sort?: string) => {
    const response = await axiosInstance.get(`${USER_APIS.booking}`, {
        params: { page, limit, search, sort },
    });
    return response.data;
};

export const cancelBooking = async (bookingId: string) => {
    const response = await axiosInstance.delete(`${USER_APIS.cancelBooking}/${bookingId}`);
    return response.data;
};

export const createBooking = async (payload: BookingPayload) => {
    const response = await axiosInstance.post(`${USER_APIS.booking}`, payload);
    return response.data;
};

//payment
export const createPaymentIntent = async (data: { amount: number }) => {
    const response = await axiosInstance.post(`${USER_APIS.payment}/online`, data);
    return response.data;
};

export const addWalletCredit = async (amount: number) => {
    const response = await axiosInstance.put(`${USER_APIS.wallet}`, { amount });
    return response.data;
};

export const createWallet = async () => {
    const response = await axiosInstance.post(`${USER_APIS.wallet}`);
    return response.data;
};

export const getWallet = async () => {
    const response = await axiosInstance.get(`${USER_APIS.wallet}`);
    return response.data;
};

export const getUserTransactions = async (page: number, limit: number) => {
    const response = await axiosInstance.get(`${USER_APIS.transactions}`, {
        params: { page, limit },
    });
    return response.data;
}

export const confirmBooking = async (
    vendorId: string,
    data: {
        hotelId: string;
        roomId: string;
        checkIn: string;
        checkOut: string;
        guests: number;
        totalPrice: number;
    },
    method: 'wallet' | 'online'
) => {
    const response = await axiosInstance.post(`${USER_APIS.payment}/${vendorId}/booking?method=${method}`, data);
    return response.data;
};

//subscription
export const getUserSubscriptions = async () => {
    const response = await axiosInstance.get(`${USER_APIS.plans}`);
    return response.data;
}

