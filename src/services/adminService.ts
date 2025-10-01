import { TGetAllUsersResponse, TGetVendorsResponse } from "@/types/response.types";
import { axiosInstance } from "./axiosInstance";
import { TUpdateVendorReqValues } from "@/types/auth.types";
import { TCreateAmenityData } from "@/types/component.types";
import { User } from "@/types/user.types";
import { TSortOption } from "@/types/custom.types";
import { ADMIN_APIS } from "./apiConstants";


//customers manage
export const getAllUsers = async (page = 1, limit = 10, role: string, search?: string, sortOption?: TSortOption): Promise<TGetAllUsersResponse> => {
    const params: any = { page, limit, role, search };
    if (sortOption) {
        const [field, order] = Object.entries(sortOption)[0];
        params.sortField = field;
        params.sortOrder = order;
    }

    const response = await axiosInstance.get(`${ADMIN_APIS.customers}`, { params });
    return response.data;
};

export const toggleBlockUser = async (userId: string) => {
    const response = await axiosInstance.patch(`${ADMIN_APIS.customers}/${userId}/status`);
    return response.data;
};

export const getVendors = async (page = 1, limit = 10, search?: string, sortOption?: TSortOption): Promise<TGetVendorsResponse> => {
    const params: any = { page, limit, search };
    if (sortOption) {
        const [field, order] = Object.entries(sortOption)[0];
        params.sortField = field;
        params.sortOrder = order;
    }

    const response = await axiosInstance.get(`${ADMIN_APIS.vendors}/requests`, { params })
    return response.data
}

export const updateVendorVerify = async (data: TUpdateVendorReqValues) => {
    const response = await axiosInstance.patch(`${ADMIN_APIS.vendors}/${data.vendorId}/verify`, data);
    return response.data;
};

//amenities
export const getAllAmenities = async (page: number, limit: number, type: 'hotel' | 'room', search?: string, sortOption?: TSortOption) => {
    const params: any = { page, limit, type, search };
    if (sortOption) {
        const [field, order] = Object.entries(sortOption)[0];
        params.sortField = field;
        params.sortOrder = order;
    }

    const response = await axiosInstance.get(`${ADMIN_APIS.amenities}`, { params });
    return response.data;
};

export const createAmenity = async (data: TCreateAmenityData) => {
    const response = await axiosInstance.post(`${ADMIN_APIS.amenities}`, data);
    return response.data;
}

export const updateAmenity = async (data: Partial<TCreateAmenityData> & { id: string }) => {
    const { id, ...rest } = data;
    const response = await axiosInstance.put(`${ADMIN_APIS.amenities}/${id}`, rest);
    return response.data;
};

export const toggleBlockAmenity = async (amenityId: string) => {
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
export const getAllPlans = async () => {
    const response = await axiosInstance.get(`${ADMIN_APIS.plans}`);
    return response.data;
}