import React from 'react'
import Login from '@/components/auth/Login';
import { useLogin } from '@/hooks/auth/useLogin';
import { TRoles } from '@/types/Auth.Types';

const AdminLoginPage: React.FC = () => {
    const role: TRoles = "admin";

    const { mutate: loginUser, isPending } = useLogin(role)

    return <Login role={role} onSubmit={loginUser} isLoading={isPending} />;
}

export default AdminLoginPage