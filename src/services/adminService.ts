import { TGetAllUsersResponse, TGetVendorsResponse } from "@/types/response.types";
import { axiosInstance } from "./axiosInstance";
import { TUpdateVendorReqValues } from "@/types/Auth.Types";
import { TCreateAmenityData } from "@/types/component.types";


export const getAllUsers = async (page = 1, limit = 10, role: string, search?: string): Promise<TGetAllUsersResponse> => {
    const response = await axiosInstance.get(`/admin/users`, { params: { page, limit, role, search } });
    return response.data
};

export const toggleBlockUser = async (userId: string) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/block-toggle`);
    return response.data;
};

export const getVendors = async (page = 1, limit = 10, search?: string): Promise<TGetVendorsResponse> => {
    const response = await axiosInstance.get(`/admin/vendor-requests`, { params: { page, limit, search } })
    return response.data
}

export const updateVendorVerify = async (data: TUpdateVendorReqValues) => {
    const response = await axiosInstance.patch(`/admin/vendor/${data.vendorId}/verify`, data);
    return response.data;
};

export const getAllAmenities = async (page: number, limit: number, search?: string) => {
    const response = await axiosInstance.get(`/admin/amenities`, {
        params: { page, limit, search },
    });
    return response.data;
};

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