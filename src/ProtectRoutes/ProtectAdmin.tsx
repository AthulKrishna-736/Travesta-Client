import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
    children: JSX.Element;  
}

const ProtectedAdmin: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.admin.admin);  

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;  
};

export default ProtectedAdmin;