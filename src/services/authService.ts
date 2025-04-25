import { LoginFormProps, LoginFormValues, OtpFormValues, SignUpFormValues } from "@/types/Auth.Types";
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

export const login = async (data: LoginFormValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/login`, data);
    return response.data;
};

export const register = async (data: SignUpFormValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/signup`, data);
    return response.data;
};

export const verifyOtp = async (data: OtpFormValues, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/verifyOtp`, data);
    return response.data;
};

export const forgotPass = async (data: { email: string }, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/forgot-password`, data)
    return response.data
}

export const resendOtp = async (data: { userId: string }, role: string) => {
    const endpoint = getEndpoint(role)
    const response = await axiosInstance.post(`${endpoint}/auth/resendOtp`, data)
    return response.data
}

// export const resetPassword = async(data: any, role: string)

export const logout = async () => {
    const response = await axiosInstance.post(`/auth/logout`);
    return response.data;
};