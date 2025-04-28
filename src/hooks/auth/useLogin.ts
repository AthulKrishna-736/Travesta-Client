import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/authService';
import { showError, showSuccess } from '@/utils/customToast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setUser } from '@/store/slices/authSlice';
import { TLoginFormValues } from '@/types/Auth.Types';
import { useNavigate } from 'react-router-dom';
import { setAdmin } from '@/store/slices/adminSlice';


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