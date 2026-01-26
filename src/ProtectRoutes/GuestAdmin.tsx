import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface GuestRouteProps {
    children: JSX.Element;  
}

const ProtectAdminGuest: React.FC<GuestRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.user.user?.id);  

    if (user) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;  
};

export default ProtectAdminGuest;
