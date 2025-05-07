import { logoutUser } from '@/store/slices/authSlice';
import { logoutVendor } from '@/store/slices/vendorSlice';
import store from '@/store/store';
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
        if(response.data.message == 'User blocked successfully'){
            showError(response.data.message)
            store.dispatch(logoutUser())
            window.location.href = '/user/login'
        } else if (response.data.message == 'Vendor blocked successfully'){
            showError(response.data.message)
            store.dispatch(logoutVendor())
            window.location.href = '/vendor/login'
        }

        return response
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

