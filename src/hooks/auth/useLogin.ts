import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/authService';
import { showError, showSuccess } from '@/utils/customToast';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setUser } from '@/store/slices/userSlice';
import { TLoginFormValues } from '../../types/authentication.types';
import { useNavigate } from 'react-router-dom';
import { setAdmin } from '@/store/slices/adminSlice';
import { setVendor } from '@/store/slices/vendorSlice';
import { ICustomError } from '@/types/custom.types';
import { useSelector } from 'react-redux';
import { clearLastVisitedPath } from '@/store/slices/navigationSlice';


export const useLogin = (role: string) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const lastVisitedPath = useSelector((state: RootState) => state.navigation.lastVisitedPath);

    return useMutation({
        mutationFn: (values: TLoginFormValues) => {
            const payload = { ...values, role }
            return login(payload, role);
        },
        onSuccess: (res) => {
            if (role === 'admin') {
                dispatch(setAdmin(res.data))
                navigate(`/${role}/dashboard`)
            } else if (role === 'vendor') {
                dispatch(setVendor(res.data))
                navigate(`/${role}/home`)
            } else {
                dispatch(setUser(res.data))
                console.log(lastVisitedPath)
                if (lastVisitedPath) {
                    console.log('Redirecting to saved path:', lastVisitedPath);
                    window.location.href = lastVisitedPath;
                    dispatch(clearLastVisitedPath());
                } else {
                    navigate(`/${role}/home`)
                }
            }
            showSuccess(res.message || 'Login successful')
        },
        onError: (error: ICustomError) => {
            console.log('error logging: ', error)
            showError(error.response.data.message || 'Something went wrong')
        }
    })
}