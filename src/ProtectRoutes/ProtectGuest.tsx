import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface GuestRouteProps {
    children: JSX.Element;
}

const ProtectGuest: React.FC<GuestRouteProps> = ({ children }) => {
    const auth = useSelector((s: RootState) => s.user.user)

    if (auth) {
        return <Navigate to={`/${auth.role}/home`} replace />
    }

    return children;
};

export default ProtectGuest;
