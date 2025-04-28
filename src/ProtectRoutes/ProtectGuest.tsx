import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface GuestRouteProps {
    children: JSX.Element;  
}

const ProtectGuest: React.FC<GuestRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.auth.user);  

    if (user) {
        return <Navigate to="/user/home" replace />;
    }

    return children;  
};

export default ProtectGuest;
