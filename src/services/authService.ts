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

export const login = async (data: any, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/login`, data);
    return response.data;
};

export const register = async (data: any, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/signup`, data);
    return response.data;
};

export const verifyOtp = async (data: { userId: string; otp: string; purpose: "signup" | "reset" }, role: string) => {
    const endpoint = getEndpoint(role);
    const response = await axiosInstance.post(`${endpoint}/auth/verifyOtp`, data);
    return response.data;
};

export const logout = async () => {
    const response = await axiosInstance.post(`/auth/logout`);
    return response.data;
};