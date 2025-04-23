import React from 'react'
import { login } from '@/services/authService';
import { showError, showSuccess } from '@/utils/customToast';
import Login from '@/components/auth/Login';

const LoginPage: React.FC = () => {
    const role = "user";

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            const response = await login(values, role);
            console.log("User data: ", response);
            showSuccess('Login successful!')
        } catch (error: any) {
            showError(error.response.data.error)
            console.log('error in login: ', error)
        }
    };

    return <Login role={role} onSubmit={handleLogin} />;
}

export default LoginPage