import { TForgotPassValues, TGoogleLoginValues, TLoginFormValues, TOtpFormValues, TResentOtpValues, TResetPassValues, TRoles, TSignUpFormValues } from '../types/authentication.types';
import { axiosInstance } from "./axiosInstance";
import { AUTH_APIS } from "./apiConstants";

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
    const response = await axiosInstance.post(`${endpoint}${AUTH_APIS.login}`, data);
    return response.data;
};

export const googleLogin = async (data: TGoogleLoginValues, role: string) => {
    const endpoint = getEndpoint(role)
    const response = await axiosInstance.post(`${endpoint}${AUTH_APIS.googleLogin}`, data);
    return response.data
}

export const register = async (data: TSignUpFormValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}${AUTH_APIS.signup}`, data);
    return response.data;
};

export const verifyOtp = async (data: TOtpFormValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}${AUTH_APIS.verifyOtp}`, data);
    return response.data;
};

export const forgotPass = async (data: TForgotPassValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}${AUTH_APIS.forgotPass}`, data)
    return response.data
}

export const resendOtp = async (data: TResentOtpValues, role: string) => {
    const endpoint = getEndpoint(role)
    const response = await axiosInstance.post(`${endpoint}${AUTH_APIS.resendOtp}`, data)
    return response.data
}

export const resetPassword = async (data: TResetPassValues, role: string) => {
    const endpoint = getEndpoint(role)
    const response = await axiosInstance.patch(`${endpoint}${AUTH_APIS.resetPass}`, data)
    return response.data
}

export const logout = async (role: TRoles) => {
    const endpoint = getEndpoint(role)
    const response = await axiosInstance.post(`${endpoint}${AUTH_APIS.logout}`);
    return response.data;
};