import React from 'react'
import Login from '@/components/auth/Login';
import { useLogin } from '@/hooks/auth/useLogin';
import { TRoles } from '@/types/Auth.Types';

const LoginPage: React.FC = () => {
    const role: Exclude<TRoles, 'admin'> = "user";

    const { mutate: loginUser, isPending } = useLogin(role)

    return <Login role={role} onSubmit={loginUser} isLoading={isPending} />;
}

export default LoginPage