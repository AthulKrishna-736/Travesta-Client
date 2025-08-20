import { TGetAllUsersResponse, TGetVendorsResponse } from "@/types/response.types";
import { axiosInstance } from "./axiosInstance";
import { TUpdateVendorReqValues } from "@/types/auth.types";
import { TCreateAmenityData } from "@/types/component.types";
import { User } from "@/types/user.types";
import { TSortOption } from "@/types/custom.types";


export const getAllUsers = async (page = 1, limit = 10, role: string, search?: string, sortOption?: TSortOption): Promise<TGetAllUsersResponse> => {
    const params: any = { page, limit, role, search };
    if (sortOption) {
        const [field, order] = Object.entries(sortOption)[0];
        params.sortField = field;
        params.sortOrder = order;
    }

    const response = await axiosInstance.get(`/admin/users`, { params });
    return response.data;
};

export const toggleBlockUser = async (userId: string) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/block-toggle`);
    return response.data;
};

export const getVendors = async (page = 1, limit = 10, search?: string, sortOption?: TSortOption): Promise<TGetVendorsResponse> => {
    const params: any = { page, limit, search };
    if (sortOption) {
        const [field, order] = Object.entries(sortOption)[0];
        params.sortField = field;
        params.sortOrder = order;
    }

    const response = await axiosInstance.get(`/admin/vendor-requests`, { params })
    return response.data
}

export const updateVendorVerify = async (data: TUpdateVendorReqValues) => {
    const response = await axiosInstance.patch(`/admin/vendor/${data.vendorId}/verify`, data);
    return response.data;
};

export const getAllAmenities = async (page: number, limit: number, type: 'hotel' | 'room', search?: string, sortOption?: TSortOption) => {
    const params: any = { page, limit, type, search };
    if (sortOption) {
        const [field, order] = Object.entries(sortOption)[0];
        params.sortField = field;
        params.sortOrder = order;
    }

    const response = await axiosInstance.get(`/admin/amenities`, { params });
    return response.data;
};

export const getUsedActiveAmenities = async () => {
    const response = await axiosInstance.get(`/admin/amenities/used`);
    return response.data;
}

export const getActiveAmenities = async () => {
    const response = await axiosInstance.get('/admin/amenities/active');
    return response.data;
}

export const createAmenity = async (data: TCreateAmenityData) => {
    const response = await axiosInstance.post(`/admin/amenities`, data);
    return response.data;
}

export const updateAmenity = async (data: Partial<TCreateAmenityData> & { id: string }) => {
    const { id, ...rest } = data;
    const response = await axiosInstance.patch(`/admin/amenities/${id}`, rest);
    return response.data;
};

export const toggleBlockAmenity = async (amenityId: string) => {
    const response = await axiosInstance.patch(`/admin/amenities/${amenityId}/block-toggle`);
    return response.data;
};

export const getAdminChatVendors = async (search?: string): Promise<Pick<User, 'id' | 'firstName' | 'role'>[] | null> => {
    const response = await axiosInstance.get('/admin/chat-vendors', {
        params: { search },
    })
    return response.data?.data;
}