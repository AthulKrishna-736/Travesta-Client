import { GetAllUsersResponse, GetVendorsResponse } from "@/types/response.types";
import { axiosInstance } from "./axiosInstance";
import { TUpdateVendorReqValues } from "@/types/auth.types";


export const getAllUsers = async (page = 1, limit = 10, role: string): Promise<GetAllUsersResponse> => {
    const response = await axiosInstance.get(`/admin/users`, { params: { page, limit, role } });
    return response.data
};

export const toggleBlockUser = async (userId: string) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/block-toggle`);
    return response.data;
};

export const getVendors = async (page = 1, limit = 10): Promise<GetVendorsResponse> => {
    const response = await axiosInstance.get(`/admin/vendor-requests`, { params: { page, limit } })
    return response.data
}

export const updateVendorVerify = async (data: TUpdateVendorReqValues) => {
    const response = await axiosInstance.patch(`/admin/vendor/${data.vendorId}/verify`, data);
    return response.data;
};
