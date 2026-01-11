import { ChatItem, TResponseChat } from "@/types/chat.types";
import { USER_APIS, VENDOR_APIS } from "../constants/apiConstants";
import { axiosInstance } from "./axiosInstance"
import { IUser } from "@/types/user.types";
import { TApiSuccessResponse } from "@/types/custom.types";
import { IAmenity } from "@/types/amenities.types";
import { IHotel } from "@/types/hotel.types";
import { IRoom } from "@/types/room.types";
import { IRating } from "@/types/rating.types";
import { ICoupon, TCreateCoupon, TUpdateCoupon } from "@/types/coupon.types";
import { IOffer, TCreateOffer, TUpdateOffer } from "@/types/offer.types";
import { TVendorAnalyticsData } from "@/types/analytics.types";


//vendor profile
export const getVendor = async (): Promise<TApiSuccessResponse<IUser>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.profile}`);
    return response.data;
}

export const updateVendor = async (formData: FormData): Promise<TApiSuccessResponse<IUser>> => {
    const response = await axiosInstance.put(`${VENDOR_APIS.profile}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const uplodKyc = async (formData: FormData): Promise<TApiSuccessResponse<IUser>> => {
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
export const createHotel = async (formData: FormData): Promise<TApiSuccessResponse<IHotel>> => {
    const response = await axiosInstance.post(`${VENDOR_APIS.hotels}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data;
}

export const getHotelByVendor = async (hotelId: string): Promise<TApiSuccessResponse<IHotel>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.hotel}/${hotelId}`);
    return response.data;
};

export const getHotelsByVendor = async (page: number, limit: number, search?: string): Promise<TApiSuccessResponse<IHotel[]>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.hotels}`, {
        params: { page, limit, search },
    });
    return response.data;
};

export const updateHotel = async (id: string, formData: FormData): Promise<TApiSuccessResponse<IHotel>> => {
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

export const getTrendingHotels = async () => {
    const response = await axiosInstance.get(`${USER_APIS.hotels}/trending`);
    return response.data;
}

//rooms
export const getAllRooms = async (page: number, limit: number, search?: string, hotelId?: string): Promise<TApiSuccessResponse<IRoom[]>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.rooms}`, {
        params: { page, limit, search, hotelId }
    });
    return response.data;
};

export const createRoom = async (formData: FormData): Promise<TApiSuccessResponse<IRoom>> => {
    const response = await axiosInstance.post(`${VENDOR_APIS.rooms}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateRoom = async (roomId: string, formData: FormData): Promise<TApiSuccessResponse<IRoom>> => {
    const response = await axiosInstance.put(`${VENDOR_APIS.rooms}/${roomId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getRoomById = async (roomId: string): Promise<TApiSuccessResponse<IRoom>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.rooms}/${roomId}`);
    return response.data;
};


//amenities
export const getVendorAmenities = async (): Promise<TApiSuccessResponse<IAmenity[]>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.amenities}`);
    return response.data;
}


//chat
export const getChattedCustomers = async (search?: string): Promise<ChatItem[]> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.chat}/vendors`, {
        params: { search }
    });
    return response.data?.data
};

export const getVendorChatMessages = async (userId: string): Promise<TResponseChat[]> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.chat}/${userId}/messages`);
    return response.data?.data;
};

export const getVendorUnreadChats = async (): Promise<TApiSuccessResponse<{ id: string, count: number }[]>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.chat}/unread`);
    return response.data;
};

export const getBookingsToVendor = async (page: number, limit: number, hotelId?: string, startDate?: string, endDate?: string) => {
    const response = await axiosInstance.get(`${VENDOR_APIS.booking}`, {
        params: { page, limit, hotelId, startDate, endDate },
    });
    return response.data;
};

//analytics
export const getVendorAnalytics = async (startDate?: string, endDate?: string): Promise<TApiSuccessResponse<TVendorAnalyticsData>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.analytics}`, {
        params: { startDate, endDate },
    });
    return response.data;
}

//ratings
export const getHotelRatings = async (hotelId: string, page: number, limit: number): Promise<TApiSuccessResponse<IRating[]>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.rating}/${hotelId}`, {
        params: { page, limit }
    });
    return response.data;
}

//coupons
export const createCoupon = async (data: TCreateCoupon): Promise<TApiSuccessResponse<ICoupon>> => {
    const response = await axiosInstance.post(`${VENDOR_APIS.coupon}`, data)
    return response.data;
}

export const updateCoupon = async (couponId: string, data: TUpdateCoupon): Promise<TApiSuccessResponse<ICoupon>> => {
    const response = await axiosInstance.put(`${VENDOR_APIS.coupon}/${couponId}`, data)
    return response.data;
}

export const getVendorCoupon = async (page: number, limit: number, search?: string): Promise<TApiSuccessResponse<ICoupon[]>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.coupon}`, {
        params: { page, limit, search }
    });
    return response.data;
}

export const toggleCouponStatus = async (couponId: string): Promise<TApiSuccessResponse<ICoupon>> => {
    const response = await axiosInstance.patch(`${VENDOR_APIS.coupon}/${couponId}`);
    return response.data;
}

//offers
export const createOffer = async (data: TCreateOffer): Promise<TApiSuccessResponse<IOffer>> => {
    const response = await axiosInstance.post(`${VENDOR_APIS.offers}`, data);
    return response.data;
}

export const updateOffer = async (offerId: string, data: TUpdateOffer): Promise<TApiSuccessResponse<IOffer>> => {
    const response = await axiosInstance.put(`${VENDOR_APIS.offers}/${offerId}`, data);
    return response.data;
}

export const getVendorOffers = async (page: number, limit: number, search?: string): Promise<TApiSuccessResponse<IOffer[]>> => {
    const response = await axiosInstance.get(`${VENDOR_APIS.offers}`, {
        params: { page, limit, search },
    });
    return response.data;
}

export const toggleOfferStatus = async (offerId: string): Promise<TApiSuccessResponse<IOffer>> => {
    const response = await axiosInstance.patch(`${VENDOR_APIS.offers}/${offerId}`);
    return response.data;
}