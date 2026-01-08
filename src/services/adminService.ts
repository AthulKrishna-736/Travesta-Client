import { axiosInstance } from "./axiosInstance";
import { TUpdateVendorReqValues } from '../types/authentication.types';
import { IAmenity, TAmenityType, TCreateAmenityData } from "@/types/amenities.types";
import { IUser, User } from "@/types/user.types";
import { TApiSuccessResponse, TSortOption } from "@/types/custom.types";
import { ADMIN_APIS } from "../constants/apiConstants";
import { ISubscription, TCreatePlan, TUpdatePlan } from "@/types/plan.types";
import { TAdminAnalyticsData } from "@/types/analytics.types";


//customers manage
export const getAllUsers = async (page: number, limit: number, role: string, search?: string, sortOption?: TSortOption): Promise<TApiSuccessResponse<IUser[]>> => {
    const params: any = { page, limit, role, search };
    if (sortOption) {
        const [field, order] = Object.entries(sortOption)[0];
        params.sortField = field;
        params.sortOrder = order;
    }

    const response = await axiosInstance.get(`${ADMIN_APIS.customers}`, { params });
    return response.data;
};

export const toggleBlockUser = async (userId: string): Promise<TApiSuccessResponse<IUser>> => {
    const response = await axiosInstance.patch(`${ADMIN_APIS.customers}/${userId}/status`);
    return response.data;
};

export const getVendors = async (page: number, limit: number, search?: string, sortOption?: TSortOption): Promise<TApiSuccessResponse<IUser[]>> => {
    const params: any = { page, limit, search };
    if (sortOption) {
        const [field, order] = Object.entries(sortOption)[0];
        params.sortField = field;
        params.sortOrder = order;
    }

    const response = await axiosInstance.get(`${ADMIN_APIS.vendors}/requests`, { params })
    return response.data
}

export const updateVendorVerify = async (data: TUpdateVendorReqValues): Promise<TApiSuccessResponse<null>> => {
    const response = await axiosInstance.patch(`${ADMIN_APIS.vendors}/${data.vendorId}/verify`, data);
    return response.data;
};

//amenities
export const getAllAmenities = async (
    page: number,
    limit: number,
    type: TAmenityType,
    search?: string,
    sortOption?: TSortOption
): Promise<TApiSuccessResponse<IAmenity[]>> => {
    const params: any = { page, limit, type, search };
    if (sortOption) {
        const [field, order] = Object.entries(sortOption)[0];
        params.sortField = field;
        params.sortOrder = order;
    }

    const response = await axiosInstance.get(`${ADMIN_APIS.amenities}`, { params });
    return response.data;
};

export const createAmenity = async (data: TCreateAmenityData): Promise<TApiSuccessResponse<IAmenity>> => {
    const response = await axiosInstance.post(`${ADMIN_APIS.amenities}`, data);
    return response.data;
}

export const updateAmenity = async (data: Partial<TCreateAmenityData> & { id: string }): Promise<TApiSuccessResponse<IAmenity>> => {
    const { id, ...rest } = data;
    const response = await axiosInstance.put(`${ADMIN_APIS.amenities}/${id}`, rest);
    return response.data;
};

export const toggleBlockAmenity = async (amenityId: string): Promise<TApiSuccessResponse<IAmenity>> => {
    const response = await axiosInstance.patch(`${ADMIN_APIS.amenities}/${amenityId}`);
    return response.data;
};

//chat
export const getAdminChatVendors = async (search?: string): Promise<Pick<User, 'id' | 'firstName' | 'role'>[] | null> => {
    const response = await axiosInstance.get(`${ADMIN_APIS.chat}/vendors`, {
        params: { search },
    })
    return response.data?.data;
}

export const getAdminChatMessages = async (userId: string) => {
    const response = await axiosInstance.get(`${ADMIN_APIS.chat}/${userId}/messages`);
    return response.data?.data;
}

export const getAdminUnreadMsg = async () => {
    const response = await axiosInstance.get(`${ADMIN_APIS.chat}/unread`);
    return response.data;
}

//subscription
export const getAllPlans = async (): Promise<TApiSuccessResponse<ISubscription[]>> => {
    const response = await axiosInstance.get(`${ADMIN_APIS.plans}`);
    return response.data;
}

export const createPlan = async (data: TCreatePlan): Promise<TApiSuccessResponse<ISubscription>> => {
    const response = await axiosInstance.post(`${ADMIN_APIS.plans}`, data)
    return response.data;
}

export const updatePlan = async (data: TUpdatePlan, planId: string): Promise<TApiSuccessResponse<ISubscription>> => {
    const response = await axiosInstance.put(`${ADMIN_APIS.plans}/${planId}`, data);
    return response.data;
}

export const getAllPlanHistory = async (page: number, limit: number, type: 'basic' | 'medium' | 'vip' | 'all') => {
    const response = await axiosInstance.get(`${ADMIN_APIS.planHistory}`, {
        params: { page, limit, type }
    });
    return response.data;
}

//analytics
export const getAdminAnalytics = async (): Promise<TApiSuccessResponse<TAdminAnalyticsData>> => {
    const response = await axiosInstance.get(`${ADMIN_APIS.analytics}`)
    return response.data;
}