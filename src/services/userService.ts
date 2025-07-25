import { TResponseChat } from "@/types/chat.types";
import { axiosInstance } from "./axiosInstance"
import { User } from "@/types/user.types";

//user
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

//hotel
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

//chat
export const getChatMessages = async (userId: string): Promise<TResponseChat[] | null> => {
    const response = await axiosInstance.get(`/users/chat/${userId}`);
    return response.data?.data;
};

export const getChattedVendors = async (search?: string): Promise<Pick<User, 'id' | 'firstName' | 'role'>[] | null> => {
    const response = await axiosInstance.get('/users/chat-vendors', {
        params: { search }
    })
    return response.data?.data
}

//booking
export const getUserBookings = async (page: number, limit: number) => {
    const response = await axiosInstance.get('/users/bookings', {
        params: { page, limit }
    });
    return response.data
};

export const cancelBooking = async (bookingId: string) => {
    const response = await axiosInstance.delete(`/users/booking/${bookingId}`);
    return response.data;
};

export const createBooking = async (payload: any) => {
    const response = await axiosInstance.post('/users/booking', payload);
    return response.data?.data;
};

//payment
export const createPaymentIntent = async (amount: number) => {
    const response = await axiosInstance.post('/users/wallet/payment-intent', { amount });
    return response.data;
};

export const addWalletCredit = async (amount: number) => {
    const response = await axiosInstance.post('/users/wallet/transaction', {
        type: 'credit',
        amount,
        description: 'Wallet top-up via Stripe',
        date: new Date(),
    });
    return response.data;
};

export const createWallet = async () => {
    const response = await axiosInstance.post('/users/wallet/create');
    return response.data;
}

export const getWallet = async () => {
    const response = await axiosInstance.get('/users/wallet');
    return response.data;
}

export const confirmBooking = async (amount: number, bookingId: string) => {
    const response = await axiosInstance.post('/users/wallet/transaction', {
        type: 'debit',
        amount,
        description: '',
        date: new Date(),
        relatedBookingId: bookingId,
    });
    return response.data;
}