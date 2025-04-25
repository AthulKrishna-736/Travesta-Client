import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/authService';
import { showError, showSuccess } from '@/utils/customToast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setUser } from '@/store/slices/authSlice';
import { LoginFormValues } from '@/types/Auth.Types';


export const useLogin = (role: string) => {
    const dispatch = useDispatch<AppDispatch>();

    return useMutation<any, any, LoginFormValues>({
        mutationFn: (values) => login(values, role),
        onSuccess: (data) => {
            console.log('Login success:', data)
            dispatch(setUser(data))
            showSuccess(data.message || 'Login successful')
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message || 'Login failed')
        }
    })
}