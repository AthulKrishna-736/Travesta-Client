import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/authService';
import { showError, showSuccess } from '@/utils/customToast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setUser } from '@/store/slices/authSlice';
import { TLoginFormValues } from '@/types/Auth.Types';


export const useLogin = (role: string) => {
    const dispatch = useDispatch<AppDispatch>();

    return useMutation<any, any, TLoginFormValues>({
        mutationFn: (values) => login(values, role),
        onSuccess: (res) => {
            console.log('Login success:', res)
            dispatch(setUser(res))
            showSuccess(res.message || 'Login successful')
        },
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error?.response?.data?.message || 'Something went wrong')
        }
    })
}