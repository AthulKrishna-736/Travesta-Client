import React from 'react'
import Login from '@/components/auth/Login';
import { useLogin } from '@/hooks/auth/useLogin';
import { TRoles } from '../../types/authentication.types';

const VendorLoginPage: React.FC = () => {
    const role: Exclude<TRoles, 'admin'> = "vendor";

    const { mutate: loginUser, isPending } = useLogin(role)

    return <Login role={role} onSubmit={loginUser} isLoading={isPending} />;
}

export default VendorLoginPage