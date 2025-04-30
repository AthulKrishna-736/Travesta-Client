import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/authService';
import { showError, showSuccess } from '@/utils/customToast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setUser } from '@/store/slices/authSlice';
import { TLoginFormValues } from '@/types/auth.types';
import { useNavigate } from 'react-router-dom';
import { setAdmin } from '@/store/slices/adminSlice';
import { setVendor } from '@/store/slices/vendorSlice';


export const useLogin = (role: string) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (values: TLoginFormValues) => login(values, role),
        onSuccess: (res) => {
            console.log('Login success:', res)
            if (role === 'admin') {
                dispatch(setAdmin(res.data))
                navigate(`/${role}/dashboard`)
            } else if (role === 'vendor') {
                dispatch(setVendor(res.data))
                navigate(`/${role}/home`)
            } else {
                dispatch(setUser(res.data))
                navigate(`/${role}/home`)
            }
            showSuccess(res.message || 'Login successful')
        },
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error?.response?.data?.message || 'Something went wrong')
        }
    })
}