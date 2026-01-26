import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
    children: JSX.Element;  
}

const ProtectVendor: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.user.user?.id);  

    if (!user) {
        return <Navigate to="/vendor/login" replace />;
    }

    return children;  
};

export default ProtectVendor;
