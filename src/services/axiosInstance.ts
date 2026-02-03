import { env } from '@/config/config';
import { logoutUser } from '@/store/slices/userSlice';
import store from '@/store/store';
import { showError } from '@/utils/customToast';
import axios, { AxiosError, AxiosResponse } from 'axios';

export const axiosInstance = axios.create({
    baseURL: env.SERVER_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error: AxiosError<{ success: boolean, message: string, statusCode: number }>) => {
        const pathname = window.location.pathname;
        const isUserRoute = pathname.startsWith('/user');
        const errorRes = error.response?.data;

        if (!errorRes) {
            return Promise.reject(error);
        }

        switch (errorRes.statusCode) {
            case 401:
            case 403:
                if (errorRes.message === "User is blocked" || errorRes.message === "Your session has expired. Please sign in again.") {
                    showError(errorRes.message);
                    store.dispatch(logoutUser());
                    setTimeout(() => {
                        window.location.href = isUserRoute ? '/user/login' : '/vendor/login';
                    }, 1000);
                }
                break;
        }

        return Promise.reject(error)
    }
)

