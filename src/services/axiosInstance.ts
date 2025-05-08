import { logoutUser } from '@/store/slices/authSlice';
import { logoutVendor } from '@/store/slices/vendorSlice';
import store from '@/store/store';
import { CustomErrorResponse } from '@/types/response.types';
import { showError } from '@/utils/customToast';
import axios, { AxiosError, AxiosResponse } from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})


axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error: AxiosError) => {
        const pathname = window.location.pathname;
        const isUserRoute = pathname.startsWith('/user');
        const isVendorRoute = pathname.startsWith('/vendor');
        const errorMsg = error.response?.data as CustomErrorResponse | undefined;

        if (errorMsg?.message == 'user is blocked' && isUserRoute) {
            store.dispatch(logoutUser())
            setTimeout(() => {
                window.location.href = '/vendor/login';
            }, 1000);
        } else if (errorMsg?.message == 'vendor is blocked' && isVendorRoute) {
            store.dispatch(logoutVendor())
            setTimeout(() => {
                window.location.href = '/vendor/login';
            }, 1000);
        }

        if (errorMsg?.message == 'Unauthorized access' && error.response?.status == 401) {
            if (isUserRoute) {
                showError(errorMsg.message)
                store.dispatch(logoutUser());
                setTimeout(() => {
                    window.location.href = '/user/login'
                }, 1000)
            } else if (isVendorRoute) {
                showError(errorMsg.message)
                store.dispatch(logoutVendor())
                setTimeout(() => {
                    window.location.href = '/vendor/login'
                }, 1000)
            }
        }

        return Promise.reject(error)
    }
)

