import React, { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
    children: JSX.Element
    allowedRoles?: Array<'user' | 'vendor' | 'admin'>
}

const ProtectedUser: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const auth = useSelector((s: RootState) => s.user.user)
    const location = useLocation()

    if (!auth) {
        return <Navigate to="/user/login" state={{ from: location }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        switch (auth.role) {
            case 'admin':
                return <Navigate to="/admin/dashboard" replace />
            case 'vendor':
                return <Navigate to="/vendor/home" replace />
            default:
                return <Navigate to="/user/home" replace />
        }
    }

    return children;
};

export default ProtectedUser;
