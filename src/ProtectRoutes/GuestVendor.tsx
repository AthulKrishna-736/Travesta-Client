import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectGuestVendor: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.vendor.vendor?.id);

    if (user) {
        return <Navigate to="/vendor/home" replace />;
    }

    return children;
};

export default ProtectGuestVendor;