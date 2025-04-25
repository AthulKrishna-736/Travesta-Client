import React from 'react'
import Login from '@/components/auth/Login';
import { useLogin } from '@/hooks/auth/useLogin';

const LoginPage: React.FC = () => {
    const role = "user";

    const { mutate: loginUser, isPending } = useLogin(role)

    return <Login role={role} onSubmit={loginUser} isLoading={isPending}/>;
}

export default LoginPage