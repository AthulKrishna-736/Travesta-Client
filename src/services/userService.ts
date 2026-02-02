import { ChatItem, TResponseChat } from "@/types/chat.types";
import { axiosInstance } from "./axiosInstance"
import { IUser } from "@/types/user.types";
import { BookingPayload, IBooking } from "@/types/booking.types";
import { USER_APIS } from "../constants/apiConstants";
import { TApiErrorResponse, TApiSuccessResponse } from "@/types/custom.types";
import { IAmenity } from "@/types/amenities.types";
import { IHotel, TUserHotelParams } from "@/types/hotel.types";
import { IRoom } from "@/types/room.types";
import { ITransaction, IWallet, TPaymentIntent } from "@/types/wallet.types";
import { IRating, TRatingForm } from "@/types/rating.types";
import { ISubscription } from "@/types/plan.types";
import { ICoupon } from "@/types/coupon.types";
import { AxiosError } from "axios";
import { INotification } from "@/types/notification.types";

//user profile
export const getUser = async (): Promise<TApiSuccessResponse<IUser>> => {
    const response = await axiosInstance.get(`${USER_APIS.profile}`);
    return response.data;
}

export const updateUser = async (formData: FormData): Promise<TApiSuccessResponse<IUser>> => {
    const response = await axiosInstance.put(`${USER_APIS.profile}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string; }) => {
    const response = await axiosInstance.patch(`${USER_APIS.changePass}`, data);
    return response.data;
};

//hotel
export const getAllUserHotels = async (
    page: number = 1,
    limit: number = 9,
    lat: number,
    long: number,
    rooms: number,
    filters: {
        search?: string;
        priceRange?: [number, number];
        selectedAmenities?: string[];
        roomType?: string[];
        rating?: number;
        checkIn?: string;
        checkOut?: string;
        guests?: number;
        sort?: string;
    } = {}
): Promise<TApiSuccessResponse<IHotel[]>> => {
    const { search, priceRange, selectedAmenities, roomType, checkIn, checkOut, rating, guests, sort } = filters;

    const params: TUserHotelParams = { page, limit, lat, long, rooms, search, checkIn, checkOut, rating, adults: guests, };

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


export const getUserHotelBySlug = async (hotelSlug: string): Promise<TApiSuccessResponse<IHotel>> => {
    const response = await axiosInstance.get(`${USER_APIS.hotels}/${hotelSlug}`);
    return response.data;
};

export const getHotelDetailsWithRoom = async (
    hotelId: string,
    roomId: string,
    checkIn: string,
    checkOut: string,
    rooms: number,
    adults: number,
    children: number
): Promise<TApiSuccessResponse<{ hotel: IHotel, room: IRoom, otherRooms: IRoom[] }>> => {
    try {
        const response = await axiosInstance.get(`${USER_APIS.hotel}/${hotelId}/details/${roomId}`, {
            params: { checkIn, checkOut, rooms, adults, children }
        });
        return response.data;
    } catch (err) {
        const error = err as AxiosError<TApiErrorResponse>;
        throw error.response?.data;
    }
}

//room
export const getUserRoomBySlug = async (hotelSlug: string, roomSlug: string): Promise<TApiSuccessResponse<IRoom>> => {
    const response = await axiosInstance.get(`${USER_APIS.room}/${hotelSlug}/${roomSlug}`);
    return response.data;
}

//amenities
export const getUserAmenities = async (): Promise<TApiSuccessResponse<IAmenity[]>> => {
    const response = await axiosInstance.get(`${USER_APIS.amenities}`);
    return response.data;
}

//chat
export const getChattedVendors = async (search?: string): Promise<ChatItem[]> => {
    const response = await axiosInstance.get(`${USER_APIS.chat}/vendors`, {
        params: { search }
    })
    return response.data?.data
};

export const getUserChatMessages = async (userId: string): Promise<TResponseChat[]> => {
    const response = await axiosInstance.get(`${USER_APIS.chat}/${userId}/messages`);
    return response.data?.data;
};

export const getUserUnreadChats = async (): Promise<TApiSuccessResponse<{ id: string, count: number }[]>> => {
    const response = await axiosInstance.get(`${USER_APIS.chat}/unread`);
    return response.data;
};

export const MarkMsgRead = async (receiverId: string): Promise<TApiSuccessResponse<null>> => {
    const response = await axiosInstance.post(`${USER_APIS.chat}/${receiverId}/read`)
    return response.data;
}

export const getUserChatAccess = async () => {
    const response = await axiosInstance.get(`${USER_APIS.access}`);
    return response.data;
}

//booking
export const getUserBookings = async (page: number, limit: number, search?: string, sort?: string): Promise<TApiSuccessResponse<IBooking[]>> => {
    const response = await axiosInstance.get(`${USER_APIS.booking}`, {
        params: { page, limit, search, sort },
    });
    return response.data;
};

export const cancelBooking = async (bookingId: string): Promise<TApiSuccessResponse<null>> => {
    const response = await axiosInstance.delete(`${USER_APIS.cancelBooking}/${bookingId}`);
    return response.data;
};

export const createBooking = async (payload: BookingPayload): Promise<TApiSuccessResponse<null>> => {
    const response = await axiosInstance.post(`${USER_APIS.booking}`, payload);
    return response.data;
};

//payment
export const createPaymentIntent = async (data: TPaymentIntent): Promise<TApiSuccessResponse<{ clientSecret: string }>> => {
    const response = await axiosInstance.post(`${USER_APIS.payment}/online`, data);
    return response.data;
};

export const addWalletCredit = async (amount: number) => {
    const response = await axiosInstance.put(`${USER_APIS.wallet}`, { amount });
    return response.data;
};

export const createWallet = async (): Promise<TApiSuccessResponse<IWallet>> => {
    const response = await axiosInstance.post(`${USER_APIS.wallet}`);
    return response.data;
};

export const getWallet = async (): Promise<TApiSuccessResponse<IWallet>> => {
    const response = await axiosInstance.get(`${USER_APIS.wallet}`);
    return response.data;
};

export const getUserTransactions = async (page: number, limit: number): Promise<TApiSuccessResponse<ITransaction[]>> => {
    const response = await axiosInstance.get(`${USER_APIS.transactions}`, {
        params: { page, limit },
    });
    return response.data;
}

export const confirmBooking = async (
    data: {
        vendorId: string,
        hotelId: string;
        roomId: string;
        checkIn: string;
        checkOut: string;
        guests: number;
        totalPrice: number;
    },
    method: 'wallet' | 'online'
): Promise<TApiSuccessResponse<null>> => {
    const response = await axiosInstance.post(`${USER_APIS.payment}/${data.vendorId}/booking?method=${method}`, data);
    return response.data;
};

//subscription
export const getUserSubscriptions = async (): Promise<TApiSuccessResponse<ISubscription[]>> => {
    const response = await axiosInstance.get(`${USER_APIS.plans}`);
    return response.data;
}

export const subscribePlan = async (planId: string, method: 'wallet' | 'online') => {
    const response = await axiosInstance.post(`${USER_APIS.payment}/${planId}/subscribe?method=${method}`);
    return response.data;
};

export const getActivePlan = async () => {
    const response = await axiosInstance.get(`${USER_APIS.activePlan}`);
    return response.data;
}

export const cancelSubscription = async (): Promise<TApiSuccessResponse<null>> => {
    const response = await axiosInstance.post(`${USER_APIS.cancelPlan}`);
    return response.data;
}

//ratings
export const createRating = async (data: FormData): Promise<TApiSuccessResponse<IRating>> => {
    const response = await axiosInstance.post(`${USER_APIS.rating}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateRating = async (data: TRatingForm & { ratingId: string }): Promise<TApiSuccessResponse<IRating>> => {
    const response = await axiosInstance.put(`${USER_APIS.rating}`, data);
    return response.data;
};

//coupons
export const getUserCoupons = async (vendorId: string, price: number): Promise<TApiSuccessResponse<ICoupon[]>> => {
    const response = await axiosInstance.get(`${USER_APIS.coupons}/${vendorId}`, {
        params: { price },
    });
    return response.data;
}

//notification
export const getNotification = async (): Promise<INotification[]> => {
    const response = await axiosInstance.get(`${USER_APIS.notification}`);
    return response.data.data;
}

export const markNotificationRead = async (notificaionId: string) => {
    const response = await axiosInstance.patch(`${USER_APIS.notification}/${notificaionId}`);
    return response.data;
}

export const markAllNotifications = async () => {
    const response = await axiosInstance.put(`${USER_APIS.notification}`);
    return response.data;
}