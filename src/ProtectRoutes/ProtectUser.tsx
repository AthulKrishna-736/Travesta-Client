import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
    children: JSX.Element;  
}

const ProtectedUser: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.user.user);  

    if (!user) {
        return <Navigate to="/user/login" replace />;
    }

    return children;  
};

export default ProtectedUser;
