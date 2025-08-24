import { TResponseChat } from "@/types/chat.types";
import { axiosInstance } from "./axiosInstance"
import { User } from "@/types/user.types";
import { BookingPayload } from "@/types/booking.types";
import { USER_APIS } from "./apiConstants";

//user
export const getUser = async () => {
    const response = await axiosInstance.get(`${USER_APIS.profile}`);
    return response.data;
}

export const updateUser = async (formData: FormData) => {
    const response = await axiosInstance.patch(`${USER_APIS.profile}`, formData, {
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
    } = {}
) => {
    const { search, priceRange, selectedAmenities, roomType, checkIn, checkOut, guests } = filters;

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

    const response = await axiosInstance.get(`${USER_APIS.hotels}`, { params });
    return response.data;
};


export const getUserHotelById = async (hotelId: string) => {
    const response = await axiosInstance.get(`${USER_APIS.hotels}/${hotelId}`);
    return response.data;
};

//chat
export const getChatMessages = async (userId: string): Promise<TResponseChat[] | null> => {
    const response = await axiosInstance.get(`${USER_APIS.getChat}/${userId}`);
    return response.data?.data;
};

export const getChattedVendors = async (search?: string): Promise<Pick<User, 'id' | 'firstName' | 'role'>[] | null> => {
    const response = await axiosInstance.get(`${USER_APIS.getChatVendors}`, {
        params: { search }
    })
    return response.data?.data
}

export const getUnreadChats = async () => {
    const response = await axiosInstance.get(`${USER_APIS.getChatVendors}`);
    return response.data;
}

//booking
export const getUserBookings = async (page: number, limit: number) => {
    const response = await axiosInstance.get(`${USER_APIS.booking}`, {
        params: { page, limit }
    });
    return response.data
};

export const cancelBooking = async (bookingId: string) => {
    const response = await axiosInstance.delete(`${USER_APIS.booking}/${bookingId}`);
    return response.data;
};

export const createBooking = async (payload: BookingPayload) => {
    const response = await axiosInstance.post(`${USER_APIS.booking}`, payload);
    return response.data;
};

//payment
export const createPaymentIntent = async (data: { amount: number }) => {
    const response = await axiosInstance.post(`${USER_APIS.wallet}/payment-intent`, data);
    return response.data;
};

export const addWalletCredit = async (data: { type: 'credit', amount: number, description: string, transactionId: string, }) => {
    const response = await axiosInstance.post(`${USER_APIS.wallet}/transaction`, data);
    return response.data;
};

export const createWallet = async () => {
    const response = await axiosInstance.post(`${USER_APIS.wallet}/create`);
    return response.data;
};

export const getWallet = async (page: number, limit: number) => {
    const response = await axiosInstance.get(`${USER_APIS.wallet}`, {
        params: { page, limit },
    });
    return response.data;
};

export const confirmBooking = async (data: { receiverId: string, amount: number, transactionId: string, description: string, relatedBookingId: string }) => {
    const response = await axiosInstance.post(`${USER_APIS.wallet}/transaction-transfer`, data);
    return response.data;
};
