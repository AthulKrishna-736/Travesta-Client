import { TGetAllUsersResponse, TGetVendorsResponse } from "@/types/response.types";
import { axiosInstance } from "./axiosInstance";
import { TUpdateVendorReqValues } from "@/types/Auth.Types";


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
