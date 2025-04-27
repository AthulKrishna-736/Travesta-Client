import { TForgotPassValues, TLoginFormValues, TOtpFormValues, TResentOtpValues, TResetPassValues, TSignUpFormValues } from "@/types/Auth.Types";
import { axiosInstance } from "./axiosInstance";

enum ENDPOINTS {
    user = '/users',
    vendor = '/vendor',
    admin = '/admin',
}

const getEndpoint = (role: string): string => {
    const lowerRole = role.toLowerCase() as keyof typeof ENDPOINTS;
    return ENDPOINTS[lowerRole] || "/user";
};

export const login = async (data: TLoginFormValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/login`, data);
    return response.data;
};

export const register = async (data: TSignUpFormValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/signup`, data);
    return response.data;
};

export const verifyOtp = async (data: TOtpFormValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/verifyOtp`, data);
    return response.data;
};

export const forgotPass = async (data: TForgotPassValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/forgot-password`, data)
    return response.data
}

export const resendOtp = async (data: TResentOtpValues, role: string) => {
    const endpoint = getEndpoint(role)
    const response = await axiosInstance.post(`${endpoint}/auth/resendOtp`, data)
    return response.data
}

export const resetPassword = async (data: TResetPassValues, role: string) => {
    const endpoint = getEndpoint(role)
    const response = await axiosInstance.post(`${endpoint}/auth/reset-password`, data)
    return response.data
}

export const logout = async () => {
    const response = await axiosInstance.post(`/auth/logout`);
    return response.data;
};